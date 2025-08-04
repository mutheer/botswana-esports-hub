-- Fix critical privilege escalation vulnerability
-- Drop existing policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a trigger to prevent role changes by non-admins
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If role is being changed and user is not admin, prevent the change
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT is_admin() THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce role change restrictions
DROP TRIGGER IF EXISTS enforce_role_security ON public.profiles;
CREATE TRIGGER enforce_role_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Recreate the update policy (now protected by trigger)
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