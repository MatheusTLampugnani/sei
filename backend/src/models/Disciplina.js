const db = require('../database');

class Disciplina {
  static async create({ nome, codigo, periodo, carga_horaria, modalidade }) {
    if (codigo.length > 10) {
      throw new Error('Código da disciplina deve ter no máximo 10 caracteres');
    }

    const result = await db.query(
      'INSERT INTO Disciplina (nome, codigo, periodo, carga_horaria, modalidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, codigo, periodo, carga_horaria, modalidade]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? 'SELECT * FROM Disciplina WHERE status = $1 ORDER BY nome'
      : 'SELECT * FROM Disciplina ORDER BY nome';
    const params = ativo ? ['ATIVA'] : [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Disciplina WHERE idDisciplina = $1', [id]);
    return result.rows[0];
  }

  static async findByCodigo(codigo) {
    const result = await db.query('SELECT * FROM Disciplina WHERE codigo = $1', [codigo]);
    return result.rows[0];
  }

  static async update(id, { nome, codigo, periodo, carga_horaria, modalidade }) {
    if (codigo && codigo.length > 10) {
      throw new Error('Código da disciplina deve ter no máximo 10 caracteres');
    }

    const result = await db.query(
      'UPDATE Disciplina SET nome = $1, codigo = $2, periodo = $3, carga_horaria = $4, modalidade = $5 WHERE idDisciplina = $6 RETURNING *',
      [nome, codigo, periodo, carga_horaria, modalidade, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      'UPDATE Disciplina SET status = $1 WHERE idDisciplina = $2 RETURNING *',
      ['INATIVA', id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      'UPDATE Disciplina SET status = $1 WHERE idDisciplina = $2 RETURNING *',
      ['ATIVA', id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM Disciplina');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Disciplina;