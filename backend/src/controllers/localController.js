const LocalService = require('../services/localService');

class LocalController {
  static async listarLocais(req, res) {
    try {
      const ativo = req.query.ativo !== 'false';
      const locais = await LocalService.listarLocais(ativo);
      res.json(locais);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obterLocal(req, res) {
    try {
      const local = await LocalService.obterLocal(req.params.id);
      res.json(local);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async criarLocal(req, res) {
    try {
      const novoLocal = await LocalService.criarLocal(req.body);
      res.status(201).json(novoLocal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async atualizarLocal(req, res) {
    try {
      const local = await LocalService.atualizarLocal(req.params.id, req.body);
      res.json(local);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async desativarLocal(req, res) {
    try {
      const local = await LocalService.alterarStatusLocal(req.params.id, false);
      res.json(local);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async reativarLocal(req, res) {
    try {
      const local = await LocalService.alterarStatusLocal(req.params.id, true);
      res.json(local);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async contarLocais(req, res) {
    try {
      const total = await LocalService.contarLocais();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocalController;