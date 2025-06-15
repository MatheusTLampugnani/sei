const ProfessorService = require('../services/professorService');

class ProfessorController {
  static async listarProfessores(req, res) {
    try {
      const ativo = req.query.ativo !== 'false';
      const professores = await ProfessorService.listarProfessores(ativo);
      res.json(professores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obterProfessor(req, res) {
    try {
      const professor = await ProfessorService.obterProfessor(req.params.id);
      res.json(professor);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async criarProfessor(req, res) {
    try {
      const novoProfessor = await ProfessorService.criarProfessor(req.body);
      res.status(201).json(novoProfessor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async atualizarProfessor(req, res) {
    try {
      const professor = await ProfessorService.atualizarProfessor(req.params.id, req.body);
      res.json(professor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async desativarProfessor(req, res) {
    try {
      const professor = await ProfessorService.alterarStatusProfessor(req.params.id, false);
      res.json(professor);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async reativarProfessor(req, res) {
    try {
      const professor = await ProfessorService.alterarStatusProfessor(req.params.id, true);
      res.json(professor);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  
  static async contarProfessores(req, res) {
    try {
      const total = await ProfessorService.contarProfessores();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProfessorController;