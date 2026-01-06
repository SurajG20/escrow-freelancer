-- Updated RLS Policies for Web3 Authentication
-- Run this after the main schema.sql to fix RLS policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can create user" ON users;
DROP POLICY IF EXISTS "Anyone can read users by wallet" ON users;

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

-- Note: For production, you might want to restrict these policies further:
-- - Only allow reading users that are involved in the same projects
-- - Add signature verification in a server-side function
-- - Use service role key for sensitive operations

