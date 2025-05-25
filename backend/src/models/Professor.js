const db = require('../database');

class Professor {
  static async create({ nome, email, cpf, titulacao }) {
    const result = await db.query(
      'INSERT INTO Professor (nome, email, cpf, titulacao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, cpf, titulacao]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM Professor ORDER BY nome');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Professor WHERE idProfessor = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { nome, email, cpf, titulacao }) {
    const result = await db.query(
      'UPDATE Professor SET nome = $1, email = $2, cpf = $3, titulacao = $4 WHERE idProfessor = $5 RETURNING *',
      [nome, email, cpf, titulacao, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      'UPDATE Professor SET status = $1 WHERE idProfessor = $2 RETURNING *',
      ['INATIVO', id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      'UPDATE Professor SET status = $1 WHERE idProfessor = $2 RETURNING *',
      ['ATIVO', id]
    );
    return result.rows[0];
  }
}

module.exports = Professor;