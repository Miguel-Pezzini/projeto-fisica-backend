CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  rightQuestions UUID[],
  points INT,
  passwordHashed TEXT NOT NULL,
  dificuldade INT[] NOT NULL
);