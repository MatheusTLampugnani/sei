const TurmaService = require('../services/turmaService');

class TurmaController {
  static async listarTurmas(req, res) {
    try {
      const ativo = req.query.ativo !== 'false';
      const turmas = await TurmaService.listarTurmas(ativo);
      res.json(turmas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obterTurma(req, res) {
    try {
      const turma = await TurmaService.obterTurma(req.params.id);
      res.json(turma);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async criarTurma(req, res) {
    try {
      const novaTurma = await TurmaService.criarTurma(req.body);
      res.status(201).json(novaTurma);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async atualizarTurma(req, res) {
    try {
      const turma = await TurmaService.atualizarTurma(req.params.id, req.body);
      res.json(turma);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async desativarTurma(req, res) {
    try {
      const turma = await TurmaService.alterarStatusTurma(req.params.id, false);
      res.json(turma);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async reativarTurma(req, res) {
    try {
      const turma = await TurmaService.alterarStatusTurma(req.params.id, true);
      res.json(turma);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async adicionarAluno(req, res) {
    try {
      const turmaAluno = await TurmaService.adicionarAluno(req.params.idTurma, req.params.idAluno);
      res.status(201).json(turmaAluno);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removerAluno(req, res) {
    try {
      const turmaAluno = await TurmaService.removerAluno(req.params.idTurma, req.params.idAluno);
      res.json(turmaAluno);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async listarAlunosTurma(req, res) {
    try {
      const alunos = await TurmaService.listarAlunosTurma(req.params.idTurma);
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async contarTurmas(req, res) {
    try {
      const total = await TurmaService.contarTurmas();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TurmaController;