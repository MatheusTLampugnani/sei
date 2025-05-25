const db = require('../database');

class Aluno {
  static async create({ nome, data_nascimento, cpf, email, matricula }) {
    const result = await db.query(
      'INSERT INTO Aluno (nome, data_nascimento, cpf, email, matricula) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, data_nascimento, cpf, email, matricula]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? 'SELECT * FROM Aluno WHERE status = $1 ORDER BY nome'
      : 'SELECT * FROM Aluno ORDER BY nome';
    const params = ativo ? ['ATIVO'] : [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Aluno WHERE idAluno = $1', [id]);
    return result.rows[0];
  }

  static async findByCpf(cpf) {
    const result = await db.query('SELECT * FROM Aluno WHERE cpf = $1', [cpf]);
    return result.rows[0];
  }

  static async findByMatricula(matricula) {
    const result = await db.query('SELECT * FROM Aluno WHERE matricula = $1', [matricula]);
    return result.rows[0];
  }

  static async update(id, { nome, data_nascimento, cpf, email, matricula }) {
    const result = await db.query(
      'UPDATE Aluno SET nome = $1, data_nascimento = $2, cpf = $3, email = $4, matricula = $5 WHERE idAluno = $6 RETURNING *',
      [nome, data_nascimento, cpf, email, matricula, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      'UPDATE Aluno SET status = $1 WHERE idAluno = $2 RETURNING *',
      ['INATIVO', id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      'UPDATE Aluno SET status = $1 WHERE idAluno = $2 RETURNING *',
      ['ATIVO', id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM Aluno');
    return parseInt(result.rows[0].count);
  }

  static async getTurmas(idAluno) {
    const result = await db.query(
      `SELECT t.* FROM Turma t
      JOIN Turma_has_aluno ta ON t.idTurma = ta.idTurma
      WHERE ta.idAluno = $1 AND t.status = 'ATIVA'`,
      [idAluno]
    );
    return result.rows;
  }
}

module.exports = Aluno;