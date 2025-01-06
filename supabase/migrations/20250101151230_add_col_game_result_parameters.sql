ALTER TABLE game_results
    ADD COLUMN question TEXT CHECK (char_length(name) <= 200),
    ADD COLUMN prompt TEXT CHECK (char_length(prompt) <= 500),
    ADD COLUMN context TEXT CHECK (char_length(context) <= 500),
    ADD COLUMN file TEXT CHECK (char_length(file) <= 100),
    ADD COLUMN response TEXT CHECK (char_length(response) <= 500),
    ADD COLUMN reason TEXT CHECK (char_length(reason) <= 500);
