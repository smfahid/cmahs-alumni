-- Create OTP table for password reset
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  otp_code VARCHAR(6) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_user_id ON password_reset_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_email ON password_reset_otps(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_expires_at ON password_reset_otps(expires_at);

-- Enable RLS
ALTER TABLE password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert OTPs (for password reset requests)
CREATE POLICY "Anyone can create OTP records"
  ON password_reset_otps
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read OTPs (needed for verification)
CREATE POLICY "Anyone can read OTP records"
  ON password_reset_otps
  FOR SELECT
  USING (true);

-- Allow anyone to update OTPs (for verification and attempt tracking)
CREATE POLICY "Anyone can update OTP records"
  ON password_reset_otps
  FOR UPDATE
  USING (true);

-- Allow anyone to delete OTPs (for cleanup after use)
CREATE POLICY "Anyone can delete OTP records"
  ON password_reset_otps
  FOR DELETE
  USING (true);

-- Function to clean up expired OTPs (run this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_otps
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT ALL ON password_reset_otps TO service_role;
GRANT SELECT ON password_reset_otps TO authenticated;

