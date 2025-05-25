const Local = require('../models/Local');

class LocalController {
  // Listar todos os locais
  static async listarLocais(req, res) {
    try {
      const ativo = req.query.ativo !== 'false'; // default true
      const locais = await Local.findAll(ativo);
      res.json(locais);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obter um local por ID
  static async obterLocal(req, res) {
    try {
      const local = await Local.findById(req.params.id);
      if (!local) {
        return res.status(404).json({ error: 'Local não encontrado' });
      }
      res.json(local);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar um novo local
  static async criarLocal(req, res) {
    try {
      if (await Local.findByNome(req.body.nome)) {
        return res.status(400).json({ error: 'Já existe um local com este nome' });
      }

      const novoLocal = await Local.create(req.body);
      res.status(201).json(novoLocal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar um local
  static async atualizarLocal(req, res) {
    try {
      const localExistente = await Local.findById(req.params.id);
      if (!localExistente) {
        return res.status(404).json({ error: 'Local não encontrado' });
      }

      if (req.body.nome && req.body.nome !== localExistente.nome) {
        const nomeEmUso = await Local.findByNome(req.body.nome);
        if (nomeEmUso) {
          return res.status(400).json({ error: 'Nome já está em uso por outro local' });
        }
      }

      const localAtualizado = await Local.update(req.params.id, req.body);
      res.json(localAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desativar um local
  static async desativarLocal(req, res) {
    try {
      const localDesativado = await Local.desativar(req.params.id);
      if (!localDesativado) {
        return res.status(404).json({ error: 'Local não encontrado' });
      }
      res.json(localDesativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reativar um local
  static async reativarLocal(req, res) {
    try {
      const localReativado = await Local.reativar(req.params.id);
      if (!localReativado) {
        return res.status(404).json({ error: 'Local não encontrado' });
      }
      res.json(localReativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contar total de locais
  static async contarLocais(req, res) {
    try {
      const total = await Local.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LocalController;