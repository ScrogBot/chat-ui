
ALTER TABLE game_results
    ADD COLUMN name TEXT DEFAULT 'Unspecified' CHECK (char_length(name) <= 100),
    ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;