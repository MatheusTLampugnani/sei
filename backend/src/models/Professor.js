const db = require('../database');

class Professor {
  static async create({ nome, email, cpf, titulacao }) {
    const result = await db.query(
      'INSERT INTO public.professor (nome, email, cpf, titulacao) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, cpf, titulacao]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? "SELECT * FROM public.professor WHERE status = 'ATIVO' ORDER BY nome"
      : "SELECT * FROM public.professor WHERE status = 'INATIVO' ORDER BY nome";
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM public.professor WHERE idProfessor = $1', [id]);
    return result.rows[0];
  }

  static async findByCpf(cpf) {
    const result = await db.query('SELECT * FROM public.professor WHERE cpf = $1', [cpf]);
    return result.rows[0];
  }

  static async update(id, { nome, email, cpf, titulacao }) {
    const result = await db.query(
      'UPDATE public.professor SET nome = $1, email = $2, cpf = $3, titulacao = $4 WHERE idProfessor = $5 RETURNING *',
      [nome, email, cpf, titulacao, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      "UPDATE public.professor SET status = 'INATIVO' WHERE idProfessor = $2 RETURNING *",
      ['INATIVO', id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      "UPDATE public.professor SET status = 'ATIVO' WHERE idProfessor = $2 RETURNING *",
      ['ATIVO', id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM public.professor');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Professor;