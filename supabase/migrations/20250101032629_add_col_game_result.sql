ALTER TABLE game_results
    ADD COLUMN keyword TEXT DEFAULT 'Unspecified' CHECK (char_length(name) <= 100),
    ADD COLUMN game TEXT DEFAULT 'Unspecified' CHECK (char_length(game) <= 100);