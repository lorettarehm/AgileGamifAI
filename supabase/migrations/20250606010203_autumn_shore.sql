/*
  # Add popularity counter to liked games

  1. Changes
    - Add popularity column to liked_games table
    - Set default value to 0
    - Add update policy for public access
*/

ALTER TABLE liked_games 
ADD COLUMN IF NOT EXISTS popularity integer DEFAULT 0;

-- Allow public to update popularity
CREATE POLICY "Allow public update popularity"
  ON liked_games
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);