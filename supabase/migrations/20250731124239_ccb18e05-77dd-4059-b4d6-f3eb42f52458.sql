-- Create security definer function for checking user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT COALESCE(public.get_user_role(user_uuid) = 'admin', false);
$$;

-- RLS Policies for user_games
CREATE POLICY "Users can view all user games" ON public.user_games
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own game registrations" ON public.user_games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game registrations" ON public.user_games
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game registrations" ON public.user_games
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user games" ON public.user_games
    FOR ALL USING (public.is_admin());

-- RLS Policies for user_events
CREATE POLICY "Users can view all event registrations" ON public.user_events
    FOR SELECT USING (true);

CREATE POLICY "Users can register for events" ON public.user_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event registrations" ON public.user_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own event registrations" ON public.user_events
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all event registrations" ON public.user_events
    FOR ALL USING (public.is_admin());

-- RLS Policies for activity_logs
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
    FOR SELECT USING (public.is_admin());

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_games_updated_at
    BEFORE UPDATE ON public.user_games
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_events_updated_at
    BEFORE UPDATE ON public.user_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.activity_logs (
        user_id, 
        action, 
        resource_type, 
        resource_id, 
        details
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_details
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;