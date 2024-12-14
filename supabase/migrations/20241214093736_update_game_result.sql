-- Remove `is_correct` column
ALTER TABLE game_results
DROP COLUMN is_correct;

-- Add `score` column
ALTER TABLE game_results
    ADD COLUMN score INTEGER DEFAULT 0 NOT NULL;
