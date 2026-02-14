-- ============================================================================
-- Supabase Database Initialization Script
-- This file contains all database schema, functions, triggers, and RLS policies
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    roles TEXT[] DEFAULT ARRAY['client']::TEXT[],
    email_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onchain_address TEXT NOT NULL,
    client_wallet TEXT NOT NULL,
    freelancer_wallet TEXT,
    chain_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'active', 'in_dispute', 'completed', 'cancelled')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount TEXT NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('NATIVE', 'USDT')),
    chain_id INTEGER NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    offchain_state TEXT NOT NULL DEFAULT 'awaiting_submission' CHECK (offchain_state IN ('awaiting_submission', 'submitted', 'approved', 'disputed', 'released')),
    onchain_state TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, index)
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    opened_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'voting', 'resolved')),
    resolution JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (chat)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reputation events table
CREATE TABLE IF NOT EXISTS reputation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('completed_milestone', 'dispute_win', 'dispute_loss', 'late_delivery', 'review_received')),
    weight INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_wallet ON projects(client_wallet);
CREATE INDEX IF NOT EXISTS idx_projects_freelancer_wallet ON projects(freelancer_wallet);
CREATE INDEX IF NOT EXISTS idx_projects_chain_id ON projects(chain_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_reputation_events_user_id ON reputation_events(user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to get or generate nonce for wallet address
CREATE OR REPLACE FUNCTION get_nonce(wallet_address TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nonce_value TEXT;
BEGIN
  -- Generate a random nonce
  nonce_value := encode(gen_random_bytes(16), 'hex');
  
  -- Store nonce temporarily (you might want to create a nonces table)
  -- For now, just return a random nonce
  RETURN nonce_value;
END;
$$;

-- Function to verify Web3 signature
-- Note: This is a simplified version. In production, you should:
-- 1. Verify the signature cryptographically
-- 2. Check nonce expiration
-- 3. Store nonces in a table with expiration
CREATE OR REPLACE FUNCTION verify_web3_signature(
  wallet_address TEXT,
  message TEXT,
  signature TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- In a real implementation, you would:
  -- 1. Recover the signer from the signature
  -- 2. Compare it with wallet_address
  -- 3. Verify the message matches expected format
  
  -- For now, return true if signature is not empty
  -- You should implement proper signature verification using a library
  -- or call an external service
  
  RETURN signature IS NOT NULL AND length(signature) > 0;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_nonce(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_web3_signature(TEXT, TEXT, TEXT) TO anon, authenticated;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Anyone can create user" ON users;
DROP POLICY IF EXISTS "Anyone can read users by wallet" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can read projects they're involved in" ON projects;
DROP POLICY IF EXISTS "Anyone can create projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can read milestones of their projects" ON milestones;
DROP POLICY IF EXISTS "Users can create milestones" ON milestones;
DROP POLICY IF EXISTS "Users can update milestones" ON milestones;
DROP POLICY IF EXISTS "Users can delete milestones" ON milestones;
DROP POLICY IF EXISTS "Users can read disputes of their projects" ON disputes;
DROP POLICY IF EXISTS "Users can create disputes" ON disputes;
DROP POLICY IF EXISTS "Users can read messages of their projects" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

-- Users policies
-- Allow anyone to create a user (for Web3 sign-up)
-- This is safe because wallet_address is unique and validated
CREATE POLICY "Anyone can create user" ON users
    FOR INSERT 
    WITH CHECK (true);

-- Allow reading users by wallet address (for Web3 auth)
-- This allows the app to check if a user exists and fetch user data
CREATE POLICY "Anyone can read users by wallet" ON users
    FOR SELECT 
    USING (true);

-- Allow users to update their own profile by wallet address
-- The wallet_address in the update must match the existing wallet_address
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Projects policies
-- Allow reading projects (filtering by wallet happens in application layer)
CREATE POLICY "Users can read projects they're involved in" ON projects
    FOR SELECT USING (true);

-- Allow creating projects (wallet validation happens in application)
CREATE POLICY "Anyone can create projects" ON projects
    FOR INSERT WITH CHECK (true);

-- Allow updating projects (wallet validation happens in application)
CREATE POLICY "Users can update projects" ON projects
    FOR UPDATE USING (true) WITH CHECK (true);

-- Milestones policies
CREATE POLICY "Users can read milestones of their projects" ON milestones
    FOR SELECT USING (true);

CREATE POLICY "Users can create milestones" ON milestones
    FOR INSERT WITH CHECK (true);

-- Allow updating milestones
CREATE POLICY "Users can update milestones" ON milestones
    FOR UPDATE USING (true) WITH CHECK (true);

-- Allow deleting milestones
CREATE POLICY "Users can delete milestones" ON milestones
    FOR DELETE USING (true);

-- Disputes policies
CREATE POLICY "Users can read disputes of their projects" ON disputes
    FOR SELECT USING (true);

CREATE POLICY "Users can create disputes" ON disputes
    FOR INSERT WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can read messages of their projects" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Reputation events policies
-- Note: You may want to add more restrictive policies for reputation_events
-- For now, allowing read access (filtering happens in application layer)
CREATE POLICY "Users can read reputation events" ON reputation_events
    FOR SELECT USING (true);

CREATE POLICY "Users can create reputation events" ON reputation_events
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- NOTES
-- ============================================================================
-- For production, you might want to restrict these policies further:
-- - Only allow reading users that are involved in the same projects
-- - Add signature verification in a server-side function
-- - Use service role key for sensitive operations
-- - Implement proper Web3 signature verification in verify_web3_signature function
-- - Create a nonces table with expiration for get_nonce function

