const AlunoService = require('../services/alunoService');

class AlunoController {
  static async listarAlunos(req, res) {
    try {
      const ativo = req.query.ativo !== 'false';
      const alunos = await AlunoService.listarAlunos(ativo);
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obterAluno(req, res) {
    try {
      const aluno = await AlunoService.obterAluno(req.params.id);
      res.json(aluno);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async criarAluno(req, res) {
    try {
      const novoAluno = await AlunoService.criarAluno(req.body);
      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async atualizarAluno(req, res) {
    try {
      const alunoAtualizado = await AlunoService.atualizarAluno(req.params.id, req.body);
      res.json(alunoAtualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async desativarAluno(req, res) {
    try {
      const aluno = await AlunoService.alterarStatusAluno(req.params.id, false);
      res.json(aluno);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async reativarAluno(req, res) {
    try {
      const aluno = await AlunoService.alterarStatusAluno(req.params.id, true);
      res.json(aluno);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  
  static async contarAlunos(req, res) {
    try {
      const total = await AlunoService.contarAlunos();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listarTurmasAluno(req, res) {
    try {
      const turmas = await AlunoService.listarTurmasAluno(req.params.idAluno);
      res.json(turmas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AlunoController;