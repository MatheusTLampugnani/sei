const db = require('../database');

class Aluno {
  static async create({ nome, data_nascimento, cpf, email, matricula, curso }) {
    const result = await db.query(
      'INSERT INTO aluno (nome, data_nascimento, cpf, email, matricula, curso) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, data_nascimento, cpf, email, matricula, curso]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? "SELECT * FROM aluno WHERE status = 'ATIVO' ORDER BY nome"
      : 'SELECT * FROM aluno ORDER BY nome';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM aluno WHERE idAluno = $1', [id]);
    return result.rows[0];
  }

  static async findByCpf(cpf) {
    const result = await db.query('SELECT * FROM aluno WHERE cpf = $1', [cpf]);
    return result.rows[0];
  }

  static async findByMatricula(matricula) {
    const result = await db.query('SELECT * FROM aluno WHERE matricula = $1', [matricula]);
    return result.rows[0];
  }

  static async update(id, { nome, data_nascimento, cpf, email, matricula, curso }) {
    const result = await db.query(
      'UPDATE aluno SET nome = $1, data_nascimento = $2, cpf = $3, email = $4, matricula = $5, curso = $6 WHERE idAluno = $7 RETURNING *',
      [nome, data_nascimento, cpf, email, matricula, curso, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      "UPDATE aluno SET status = 'INATIVO' WHERE idAluno = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      "UPDATE aluno SET status = 'ATIVO' WHERE idAluno = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM aluno');
    return parseInt(result.rows[0].count);
  }

  static async getTurmas(idAluno) {
    const result = await db.query(
      `SELECT t.* FROM turma t
      JOIN turma_has_aluno ta ON t.idTurma = ta.idTurma
      WHERE ta.idAluno = $1 AND t.status = 'ATIVA'`,
      [idAluno]
    );
    return result.rows;
  }
}

module.exports = Aluno;
