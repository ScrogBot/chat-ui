-- Add team and department columns to profiles table
ALTER TABLE profiles
    ADD COLUMN team TEXT DEFAULT 'Unassigned' CHECK (char_length(team) <= 50);

ALTER TABLE profiles
    ADD COLUMN department TEXT DEFAULT 'Unspecified' CHECK (char_length(department) <= 100);

-- Set default values for existing rows
UPDATE profiles
SET team = 'Unassigned',
    department = 'Unspecified'
WHERE team IS NULL OR department IS NULL;

-- Add NOT NULL constraint
ALTER TABLE profiles
    ALTER COLUMN team SET NOT NULL;

ALTER TABLE profiles
    ALTER COLUMN department SET NOT NULL;
