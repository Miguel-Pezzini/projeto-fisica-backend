CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  conteudo conteudo_enum NOT NULL,
  dificuldade INT[] NOT NULL, 
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  alternativa_e TEXT NOT NULL,
  answer resposta_enum NOT NULL,
  points INT NOT NULL
);