DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('ATIVO', 'INATIVO', 'ATIVA');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "user" (username, password_hash)
SELECT 'admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE username = 'admin');

CREATE TABLE IF NOT EXISTS Professor (
    idProfessor SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    titulacao VARCHAR(100) NOT NULL,
    status status_enum NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE IF NOT EXISTS Disciplina (
    idDisciplina SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    carga_horaria INT,
    modalidade VARCHAR(100),
    status status_enum NOT NULL DEFAULT 'ATIVA'
);

CREATE TABLE IF NOT EXISTS Local (
    idLocal SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    local VARCHAR(100) NOT NULL,
    capacidade INT NOT NULL,
    status status_enum NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE IF NOT EXISTS Aluno (
    idAluno SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    curso VARCHAR(100),
    status status_enum NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE IF NOT EXISTS Turma (
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
    status status_enum NOT NULL DEFAULT 'ATIVA',
    FOREIGN KEY (idLocal) REFERENCES Local (idLocal),
    FOREIGN KEY (idDisciplina) REFERENCES Disciplina (idDisciplina),
    FOREIGN KEY (idProfessor) REFERENCES Professor (idProfessor)
);

CREATE TABLE IF NOT EXISTS Turma_has_aluno (
    idTurma INT NOT NULL,
    idAluno INT NOT NULL,
    PRIMARY KEY (idTurma, idAluno),
    FOREIGN KEY (idTurma) REFERENCES Turma (idTurma),
    FOREIGN KEY (idAluno) REFERENCES Aluno (idAluno)
);

CREATE INDEX IF NOT EXISTS idx_professor_nome ON Professor (nome);
CREATE INDEX IF NOT EXISTS idx_disciplina_nome ON Disciplina (nome);
CREATE INDEX IF NOT EXISTS idx_aluno_nome ON Aluno (nome);
CREATE INDEX IF NOT EXISTS idx_turma_nome ON Turma (nome);