ALTER TABLE game_results
    ADD COLUMN game_type TEXT DEFAULT 'Unspecified' CHECK (char_length(game_type) <= 100);