const Disciplina = require('../models/Disciplina');

class DisciplinaController {
  // Listar todas as disciplinas
  static async listarDisciplinas(req, res) {
    try {
      const ativo = req.query.ativo !== 'false'; // default true
      const disciplinas = await Disciplina.findAll(ativo);
      res.json(disciplinas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obter uma disciplina por ID
  static async obterDisciplina(req, res) {
    try {
      const disciplina = await Disciplina.findById(req.params.id);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      res.json(disciplina);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar uma nova disciplina
  static async criarDisciplina(req, res) {
    try {
      if (await Disciplina.findByCodigo(req.body.codigo)) {
        return res.status(400).json({ error: 'Código da disciplina já existe' });
      }

      const novaDisciplina = await Disciplina.create(req.body);
      res.status(201).json(novaDisciplina);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar uma disciplina
  static async atualizarDisciplina(req, res) {
    try {
      const disciplinaExistente = await Disciplina.findById(req.params.id);
      if (!disciplinaExistente) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      if (req.body.codigo && req.body.codigo !== disciplinaExistente.codigo) {
        const codigoEmUso = await Disciplina.findByCodigo(req.body.codigo);
        if (codigoEmUso) {
          return res.status(400).json({ error: 'Código já está em uso por outra disciplina' });
        }
      }

      const disciplinaAtualizada = await Disciplina.update(req.params.id, req.body);
      res.json(disciplinaAtualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desativar uma disciplina
  static async desativarDisciplina(req, res) {
    try {
      const disciplinaDesativada = await Disciplina.desativar(req.params.id);
      if (!disciplinaDesativada) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      res.json(disciplinaDesativada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reativar uma disciplina
  static async reativarDisciplina(req, res) {
    try {
      const disciplinaReativada = await Disciplina.reativar(req.params.id);
      if (!disciplinaReativada) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      res.json(disciplinaReativada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contar total de disciplinas
  static async contarDisciplinas(req, res) {
    try {
      const total = await Disciplina.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DisciplinaController;