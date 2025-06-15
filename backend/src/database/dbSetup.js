const db = require('../database');

const createTablesQuery = `
  SET search_path TO public;

  DO $$
  BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
          CREATE TYPE public.status_enum AS ENUM ('ATIVO', 'INATIVO');
      END IF;
  END$$;

  CREATE TABLE IF NOT EXISTS public.professor (
      idProfessor SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      cpf VARCHAR(11) UNIQUE NOT NULL,
      titulacao VARCHAR(100) NOT NULL,
      status public.status_enum NOT NULL DEFAULT 'ATIVO'
  );

  CREATE TABLE IF NOT EXISTS public.disciplina (
      idDisciplina SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      codigo VARCHAR(10) UNIQUE NOT NULL,
      periodo VARCHAR(50) NOT NULL,
      carga_horaria INT,
      modalidade VARCHAR(100),
      status public.status_enum NOT NULL DEFAULT 'ATIVO'
  );

  CREATE TABLE IF NOT EXISTS public.local (
      idLocal SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL UNIQUE,
      "local" VARCHAR(100) NOT NULL,
      capacidade INT NOT NULL,
      status public.status_enum NOT NULL DEFAULT 'ATIVO'
  );

  CREATE TABLE IF NOT EXISTS public.aluno (
      idAluno SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      data_nascimento DATE,
      cpf VARCHAR(11) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
      matricula VARCHAR(50) UNIQUE NOT NULL,
      curso VARCHAR(100),
      status public.status_enum NOT NULL DEFAULT 'ATIVO'
  );

  CREATE TABLE IF NOT EXISTS public.turma (
      idTurma SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      ano_semestre VARCHAR(10),
      turno VARCHAR(50),
      horario VARCHAR(100),
      dia_semana VARCHAR(50) NOT NULL,
      horario_inicio TIME NOT NULL,
      horario_termino TIME NOT NULL,
      idLocal INT NOT NULL,
      idDisciplina INT NOT NULL,
      idProfessor INT NOT NULL,
      status public.status_enum NOT NULL DEFAULT 'ATIVO',
      FOREIGN KEY (idLocal) REFERENCES public.local (idLocal),
      FOREIGN KEY (idDisciplina) REFERENCES public.disciplina (idDisciplina),
      FOREIGN KEY (idProfessor) REFERENCES public.professor (idProfessor)
  );

  CREATE TABLE IF NOT EXISTS public.turma_has_aluno (
      idTurma INT NOT NULL,
      idAluno INT NOT NULL,
      PRIMARY KEY (idTurma, idAluno),
      FOREIGN KEY (idTurma) REFERENCES public.turma (idTurma),
      FOREIGN KEY (idAluno) REFERENCES public.aluno (idAluno)
  );

  CREATE INDEX IF NOT EXISTS idx_professor_nome ON public.professor (nome);
  CREATE INDEX IF NOT EXISTS idx_disciplina_nome ON public.disciplina (nome);
  CREATE INDEX IF NOT EXISTS idx_aluno_nome ON public.aluno (nome);
  CREATE INDEX IF NOT EXISTS idx_turma_nome ON public.turma (nome);
`;


const setupDatabase = async () => {
  try {
    await db.query(createTablesQuery);
    console.log('Tabelas verificadas/criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
  }
};

module.exports = setupDatabase;