const db = require('../database');

class Turma {
  static async create({ nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor }) {
    const result = await db.query(
      `INSERT INTO public.turma
      (nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor]
    );
    return result.rows[0];
  }

  static async findAll(ativo = true) {
    const query = ativo
      ? `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome
        FROM public.turma t
        JOIN public.disciplina d ON t.idDisciplina = d.idDisciplina
        JOIN public.professor p ON t.idProfessor = p.idProfessor
        JOIN public.local l ON t.idLocal = l.idLocal
        WHERE t.status = 'ATIVO'
        ORDER BY t.nome`
      : `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome
        FROM public.turma t
        JOIN public.disciplina d ON t.idDisciplina = d.idDisciplina
        JOIN public.professor p ON t.idProfessor = p.idProfessor
        JOIN public.local l ON t.idLocal = l.idLocal
        ORDER BY t.nome`;
    const params = [];
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT t.*, d.nome as disciplina_nome, p.nome as professor_nome, l.nome as local_nome
      FROM public.turma t
      JOIN public.disciplina d ON t.idDisciplina = d.idDisciplina
      JOIN public.professor p ON t.idProfessor = p.idProfessor
      JOIN public.local l ON t.idLocal = l.idLocal
      WHERE t.idTurma = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, { nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor }) {
    const result = await db.query(
      `UPDATE public.turma SET
      nome = $1, ano_semestre = $2, turno = $3, horario = $4, dia_semana = $5,
      horario_inicio = $6, horario_termino = $7, idLocal = $8, idDisciplina = $9, idProfessor = $10
      WHERE idTurma = $11 RETURNING *`,
      [nome, ano_semestre, turno, horario, dia_semana, horario_inicio, horario_termino, idLocal, idDisciplina, idProfessor, id]
    );
    return result.rows[0];
  }

  static async checkConflito(idLocal, dia_semana, horario_inicio, horario_termino, idTurma = null) {
    const query = `
      SELECT * FROM public.turma
      WHERE idLocal = $1
      AND dia_semana = $2
      AND status = 'ATIVO'
      AND ($5::int IS NULL OR idTurma != $5)
      AND (
        (horario_inicio < $4 AND horario_termino > $3)
      )
    `;
    const params = [idLocal, dia_semana, horario_inicio, horario_termino, idTurma];
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async desativar(id) {
    const result = await db.query(
      "UPDATE public.turma SET status = 'INATIVO' WHERE idTurma = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async reativar(id) {
    const result = await db.query(
      "UPDATE public.turma SET status = 'ATIVO' WHERE idTurma = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async count() {
    const result = await db.query('SELECT COUNT(*) FROM public.turma');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Turma;