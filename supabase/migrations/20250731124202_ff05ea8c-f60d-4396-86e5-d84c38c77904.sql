-- First check if enum exists and get its values
DO $$ 
BEGIN
    -- Try to get existing enum values
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        -- If enum exists, just add moderator if it doesn't exist
        BEGIN
            ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'moderator';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
    ELSE
        -- Create the enum with all values
        CREATE TYPE public.user_role AS ENUM ('user', 'moderator', 'admin');
    END IF;
END $$;

-- Create user_games table for tracking games a user plays
CREATE TABLE IF NOT EXISTS public.user_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    gamer_tag TEXT, -- Their username/tag for this specific game
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id) -- Prevent duplicate game registrations
);

-- Create user_events table for event registration
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'attended', 'cancelled')),
    team_name TEXT, -- For team-based events
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id) -- Prevent duplicate event registrations
);

-- Create activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL, -- 'profile', 'game', 'event', etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;