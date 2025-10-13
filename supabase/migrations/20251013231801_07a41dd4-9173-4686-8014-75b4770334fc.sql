-- Fix RLS policy on user_profiles to allow viewing assignee information
-- Drop the restrictive SELECT policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create a new policy allowing authenticated users to view all profiles
-- This is necessary for team collaboration features (seeing who tasks are assigned to)
-- Only exposes email and role (non-sensitive data)
CREATE POLICY "Authenticated users can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);