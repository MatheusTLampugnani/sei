const DisciplinaService = require('../services/disciplinaService');

class DisciplinaController {
  static async listarDisciplinas(req, res) {
    try {
      const ativo = req.query.ativo !== 'false';
      const disciplinas = await DisciplinaService.listarDisciplinas(ativo);
      res.json(disciplinas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obterDisciplina(req, res) {
    try {
      const disciplina = await DisciplinaService.obterDisciplina(req.params.id);
      res.json(disciplina);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async criarDisciplina(req, res) {
    try {
      const novaDisciplina = await DisciplinaService.criarDisciplina(req.body);
      res.status(201).json(novaDisciplina);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async atualizarDisciplina(req, res) {
    try {
      const disciplina = await DisciplinaService.atualizarDisciplina(req.params.id, req.body);
      res.json(disciplina);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async desativarDisciplina(req, res) {
    try {
      const disciplina = await DisciplinaService.alterarStatusDisciplina(req.params.id, false);
      res.json(disciplina);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async reativarDisciplina(req, res) {
    try {
      const disciplina = await DisciplinaService.alterarStatusDisciplina(req.params.id, true);
      res.json(disciplina);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  
  static async contarDisciplinas(req, res) {
    try {
      const total = await DisciplinaService.contarDisciplinas();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DisciplinaController;