-- Appoint specific user as admin
-- Update user with ID 357eb072-b67e-4674-9f76-a873d2971632 to admin role

UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = '357eb072-b67e-4674-9f76-a873d2971632';

-- Verify the update was successful
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = '357eb072-b67e-4674-9f76-a873d2971632' 
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Failed to appoint user as admin. User may not exist or update failed.';
    END IF;
END $$; 