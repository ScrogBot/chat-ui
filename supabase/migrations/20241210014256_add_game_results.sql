--- TABLE ---

CREATE TABLE IF NOT EXISTS game_results (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     question_id INT NOT NULL, -- 문제 번호
     is_correct BOOLEAN NOT NULL, -- 정답 여부
     created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMPTZ
);

--- INDEXES ---

CREATE INDEX game_results_user_id_idx ON game_results(user_id);
CREATE INDEX game_results_question_id_idx ON game_results(question_id);

--- RLS ---

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to own game results"
    ON game_results
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid() OR auth.role() = 'authenticated');

-- TRIGGERS --
CREATE TRIGGER update_game_results_updated_at
    BEFORE UPDATE ON game_results
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
