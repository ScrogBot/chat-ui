-- 기존 열 삭제
ALTER TABLE game_results
DROP COLUMN prompt,
    DROP COLUMN response,
    DROP COLUMN reason;

-- 새 열 추가 (길이 제한 1000자로 설정)
ALTER TABLE game_results
    ADD COLUMN prompt TEXT CHECK (char_length(prompt) <= 5000),
    ADD COLUMN response TEXT CHECK (char_length(response) <= 5000),
    ADD COLUMN reason TEXT CHECK (char_length(reason) <= 5000);