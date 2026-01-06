-- Supabase Edge Functions / RPC Functions for Web3 Auth
-- These functions should be created in Supabase SQL Editor

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

