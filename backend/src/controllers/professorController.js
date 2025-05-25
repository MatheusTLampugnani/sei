const Professor = require('../models/Professor');
const { validarCPF } = require('../utils/validators');

class ProfessorController {
  // Listar todos os professores
  static async listarProfessores(req, res) {
    try {
      const ativo = req.query.ativo !== 'false'; // default true
      const professores = await Professor.findAll(ativo);
      res.json(professores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obter um professor por ID
  static async obterProfessor(req, res) {
    try {
      const professor = await Professor.findById(req.params.id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.json(professor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar um novo professor
  static async criarProfessor(req, res) {
    try {
      if (!validarCPF(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }
      
      if (await Professor.findByCpf(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      const novoProfessor = await Professor.create(req.body);
      res.status(201).json(novoProfessor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar um professor
  static async atualizarProfessor(req, res) {
    try {
      if (req.body.cpf && !validarCPF(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const professorExistente = await Professor.findById(req.params.id);
      if (!professorExistente) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      if (req.body.cpf && req.body.cpf !== professorExistente.cpf) {
        const cpfEmUso = await Professor.findByCpf(req.body.cpf);
        if (cpfEmUso) {
          return res.status(400).json({ error: 'CPF já está em uso por outro professor' });
        }
      }

      const professorAtualizado = await Professor.update(req.params.id, req.body);
      res.json(professorAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desativar um professor
  static async desativarProfessor(req, res) {
    try {
      const professorDesativado = await Professor.desativar(req.params.id);
      if (!professorDesativado) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.json(professorDesativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reativar um professor
  static async reativarProfessor(req, res) {
    try {
      const professorReativado = await Professor.reativar(req.params.id);
      if (!professorReativado) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.json(professorReativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contar total de professores
  static async contarProfessores(req, res) {
    try {
      const total = await Professor.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProfessorController;