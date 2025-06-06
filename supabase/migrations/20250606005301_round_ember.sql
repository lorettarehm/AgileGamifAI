/*
  # Create liked games table

  1. New Tables
    - `liked_games`
      - `id` (uuid, primary key)
      - `game_data` (jsonb, stores complete game data)
      - `created_at` (timestamp)
      - `prompt` (text, optional prompt used to generate the game)

  2. Security
    - Enable RLS on `liked_games` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS liked_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_data jsonb NOT NULL,
  prompt text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE liked_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON liked_games
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert"
  ON liked_games
  FOR INSERT
  TO public
  WITH CHECK (true);