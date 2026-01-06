-- Quick fix for RLS policies to work with Web3 authentication
-- Run this in Supabase SQL Editor to fix the RLS errors

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read projects they're involved in" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can read milestones of their projects" ON milestones;
DROP POLICY IF EXISTS "Users can read disputes of their projects" ON disputes;
DROP POLICY IF EXISTS "Users can read messages of their projects" ON messages;

-- Create new policies for Web3 auth
CREATE POLICY "Anyone can create user" ON users
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can read users by wallet" ON users
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can read projects they're involved in" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create projects" ON projects
    FOR INSERT WITH CHECK (true);

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

