-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    roles TEXT[] DEFAULT ARRAY['client']::TEXT[],
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
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'in_dispute', 'completed', 'cancelled')),
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

-- Indexes for performance
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

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for Web3 authentication
-- Allow anyone to create a user (for Web3 sign-up)
CREATE POLICY "Anyone can create user" ON users
    FOR INSERT 
    WITH CHECK (true);

-- Allow reading users by wallet address (for Web3 auth)
CREATE POLICY "Anyone can read users by wallet" ON users
    FOR SELECT 
    USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Projects: allow reading projects by wallet address
-- For Web3 auth, we'll filter by wallet address in the application layer
CREATE POLICY "Users can read projects they're involved in" ON projects
    FOR SELECT USING (true);

-- Allow creating projects (wallet validation happens in application)
CREATE POLICY "Anyone can create projects" ON projects
    FOR INSERT WITH CHECK (true);

-- Similar policies for other tables (simplified for Web3 auth)
-- Application layer will filter by wallet address
CREATE POLICY "Users can read milestones of their projects" ON milestones
    FOR SELECT USING (true);

CREATE POLICY "Users can create milestones" ON milestones
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read disputes of their projects" ON disputes
    FOR SELECT USING (true);

CREATE POLICY "Users can create disputes" ON disputes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read messages of their projects" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (true);

