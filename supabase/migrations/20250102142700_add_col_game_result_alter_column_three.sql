-- 기존 열 삭제
ALTER TABLE game_results
    DROP COLUMN context;

-- 새 열 추가 (길이 제한 1000자로 설정)
ALTER TABLE game_results
    ADD COLUMN context TEXT CHECK (char_length(context) <= 5000);