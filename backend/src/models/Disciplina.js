const db = require('../database');

class Disciplina {
  static async create({ nome, codigo, periodo, carga_horaria, modalidade }) {
    const result = await db.query(
      'INSERT INTO public.disciplina (nome, codigo, periodo, carga_horaria, modalidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, codigo, periodo, carga_horaria, modalidade]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? "SELECT * FROM public.disciplina WHERE status = 'ATIVO' ORDER BY nome"
      : 'SELECT * FROM public.disciplina ORDER BY nome';
    const params = []; // No longer need params for status
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM public.disciplina WHERE idDisciplina = $1', [id]);
    return result.rows[0];
  }

  static async findByCodigo(codigo) {
    const result = await db.query('SELECT * FROM public.disciplina WHERE codigo = $1', [codigo]);
    return result.rows[0];
  }

  static async update(id, { nome, codigo, periodo, carga_horaria, modalidade }) {
    const result = await db.query(
      'UPDATE public.disciplina SET nome = $1, codigo = $2, periodo = $3, carga_horaria = $4, modalidade = $5 WHERE idDisciplina = $6 RETURNING *',
      [nome, codigo, periodo, carga_horaria, modalidade, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      "UPDATE public.disciplina SET status = 'INATIVO' WHERE idDisciplina = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      "UPDATE public.disciplina SET status = 'ATIVO' WHERE idDisciplina = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM public.disciplina');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Disciplina;