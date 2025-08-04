-- Fix critical privilege escalation vulnerability
-- Users should not be able to change their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies for profile updates excluding role changes
-- Note: PostgreSQL doesn't support OLD/NEW in RLS policies, so we'll use a security definer function
CREATE OR REPLACE FUNCTION public.can_update_profile(
  profile_user_id UUID,
  current_role user_role,
  new_role user_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Users can only update their own profile and cannot change their role
  RETURN (
    auth.uid() = profile_user_id AND 
    current_role = new_role
  ) OR is_admin();
END;
$$;

-- Create policy that prevents role changes by regular users
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

-- Fix activity logs security gap - only authenticated users can insert logs
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;

CREATE POLICY "Authenticated users can insert activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create admin-only activity log management
CREATE POLICY "Admins can manage all activity logs" 
ON public.activity_logs 
FOR ALL
USING (is_admin());

-- Add function to securely update user roles (admin only)
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id UUID,
  new_role user_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;

  -- Update the user's role
  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE user_id = target_user_id;

  -- Log the role change
  PERFORM log_user_activity(
    auth.uid(),
    'role_updated',
    'profile',
    target_user_id,
    jsonb_build_object(
      'new_role', new_role,
      'target_user', target_user_id
    )
  );

  RETURN TRUE;
END;
$$;