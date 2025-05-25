const db = require('../database');

class Turma {
  static async create({ nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor }) {
    const result = await db.query(
      `INSERT INTO Turma 
      (nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome 
        FROM Turma t
        JOIN Disciplina d ON t.idDisciplina = d.idDisciplina
        JOIN Professor p ON t.idProfessor = p.idProfessor
        JOIN Local l ON t.idLocal = l.idLocal
        WHERE t.status = $1
        ORDER BY t.nome`
      : `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome 
        FROM Turma t
        JOIN Disciplina d ON t.idDisciplina = d.idDisciplina
        JOIN Professor p ON t.idProfessor = p.idProfessor
        JOIN Local l ON t.idLocal = l.idLocal
        ORDER BY t.nome`;
    const params = ativo ? ['ATIVA'] : [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome 
      FROM Turma t
      JOIN Disciplina d ON t.idDisciplina = d.idDisciplina
      JOIN Professor p ON t.idProfessor = p.idProfessor
      JOIN Local l ON t.idLocal = l.idLocal
      WHERE t.idTurma = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByNome(nome) {
    const result = await db.query('SELECT * FROM Turma WHERE nome = $1', [nome]);
    return result.rows[0];
  }

  static async update(id, { nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor }) {
    const result = await db.query(
      `UPDATE Turma SET 
      nome = $1, ano_semestre = $2, turno = $3, horario = $4, dia_semana = $5, 
      horario_inicio = $6, horario_termino = $7, idLocal = $8, idDisciplina = $9, idProfessor = $10 
      WHERE idTurma = $11 RETURNING *`,
      [nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      'UPDATE Turma SET status = $1 WHERE idTurma = $2 RETURNING *',
      ['INATIVA', id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      'UPDATE Turma SET status = $1 WHERE idTurma = $2 RETURNING *',
      ['ATIVA', id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM Turma');
    return parseInt(result.rows[0].count);
  }

  static async addAluno(idTurma, idAluno) {
    const result = await db.query(
      'INSERT INTO Turma_has_aluno (idTurma, idAluno) VALUES ($1, $2) RETURNING *',
      [idTurma, idAluno]
    );
    return result.rows[0];
  }

  static async removeAluno(idTurma, idAluno) {
    const result = await db.query(
      'DELETE FROM Turma_has_aluno WHERE idTurma = $1 AND idAluno = $2 RETURNING *',
      [idTurma, idAluno]
    );
    return result.rows[0];
  }

  static async getAlunos(idTurma) {
    const result = await db.query(
      `SELECT a.* FROM Aluno a
      JOIN Turma_has_aluno ta ON a.idAluno = ta.idAluno
      WHERE ta.idTurma = $1 AND a.status = 'ATIVO'`,
      [idTurma]
    );
    return result.rows;
  }
}

module.exports = Turma;