const db = require('../database');

class Local {
  static async create({ nome, local, capacidade }) {
    const result = await db.query(
      'INSERT INTO public.local (nome, local, capacidade) VALUES ($1, $2, $3) RETURNING *',
      [nome, local, capacidade]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? "SELECT * FROM public.local WHERE status = 'ATIVO' ORDER BY nome"
      : "SELECT * FROM public.local WHERE status = 'INATIVO' ORDER BY nome";
    const params = [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM public.local WHERE idLocal = $1', [id]);
    return result.rows[0];
  }

  static async findByNome(nome) {
    const result = await db.query('SELECT * FROM public.local WHERE nome = $1', [nome]);
    return result.rows[0];
  }

  static async update(id, { nome, local, capacidade }) {
    const result = await db.query(
      'UPDATE public.local SET nome = $1, local = $2, capacidade = $3 WHERE idLocal = $4 RETURNING *',
      [nome, local, capacidade, id]
    );
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      "UPDATE public.local SET status = 'INATIVO' WHERE idLocal = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      "UPDATE public.local SET status = 'ATIVO' WHERE idLocal = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM public.local');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Local;