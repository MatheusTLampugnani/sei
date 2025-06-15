const db = require('../database');

class TurmaAluno {
  static async addAluno(idTurma, idAluno) {
    const result = await db.query(
      'INSERT INTO public.turma_has_aluno (idTurma, idAluno) VALUES ($1, $2) RETURNING *',
      [idTurma, idAluno]
    );
    return result.rows[0];
  }

  static async removeAluno(idTurma, idAluno) {
    const result = await db.query(
      'DELETE FROM public.turma_has_aluno WHERE idTurma = $1 AND idAluno = $2 RETURNING *',
      [idTurma, idAluno]
    );
    return result.rows[0];
  }

  static async getAlunosByTurma(idTurma) {
    const result = await db.query(
      `SELECT a.* FROM public.aluno a
      JOIN public.turma_has_aluno ta ON a.idAluno = ta.idAluno
      WHERE ta.idTurma = $1 AND a.status = 'ATIVO'`,
      [idTurma]
    );
    return result.rows;
  }

  static async getTurmasByAluno(idAluno) {
    const result = await db.query(
      `SELECT t.* FROM public.turma t
      JOIN public.turma_has_aluno ta ON t.idTurma = ta.idTurma
      WHERE ta.idAluno = $1 AND t.status = 'ATIVA'`,
      [idAluno]
    );
    return result.rows;
  }

  static async checkAlunoInTurma(idTurma, idAluno) {
    const result = await db.query(
      'SELECT * FROM public.turma_has_aluno WHERE idTurma = $1 AND idAluno = $2',
      [idTurma, idAluno]
    );
    return result.rows[0];
  }
}

module.exports = TurmaAluno;