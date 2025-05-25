const Aluno = require('../models/Aluno');
const { validarCPF } = require('../utils/validators');

class AlunoController {
  // Listar todos os alunos
  static async listarAlunos(req, res) {
    try {
      const ativo = req.query.ativo !== 'false'; // default true
      const alunos = await Aluno.findAll(ativo);
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obter um aluno por ID
  static async obterAluno(req, res) {
    try {
      const aluno = await Aluno.findById(req.params.id);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json(aluno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar um novo aluno
  static async criarAluno(req, res) {
    try {
      if (!validarCPF(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }
      
      if (await Aluno.findByCpf(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      if (await Aluno.findByMatricula(req.body.matricula)) {
        return res.status(400).json({ error: 'Matrícula já cadastrada' });
      }

      const novoAluno = await Aluno.create(req.body);
      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar um aluno
  static async atualizarAluno(req, res) {
    try {
      if (req.body.cpf && !validarCPF(req.body.cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const alunoExistente = await Aluno.findById(req.params.id);
      if (!alunoExistente) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      if (req.body.cpf && req.body.cpf !== alunoExistente.cpf) {
        const cpfEmUso = await Aluno.findByCpf(req.body.cpf);
        if (cpfEmUso) {
          return res.status(400).json({ error: 'CPF já está em uso por outro aluno' });
        }
      }

      if (req.body.matricula && req.body.matricula !== alunoExistente.matricula) {
        const matriculaEmUso = await Aluno.findByMatricula(req.body.matricula);
        if (matriculaEmUso) {
          return res.status(400).json({ error: 'Matrícula já está em uso por outro aluno' });
        }
      }

      const alunoAtualizado = await Aluno.update(req.params.id, req.body);
      res.json(alunoAtualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desativar um aluno
  static async desativarAluno(req, res) {
    try {
      const alunoDesativado = await Aluno.desativar(req.params.id);
      if (!alunoDesativado) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json(alunoDesativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reativar um aluno
  static async reativarAluno(req, res) {
    try {
      const alunoReativado = await Aluno.reativar(req.params.id);
      if (!alunoReativado) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json(alunoReativado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar turmas de um aluno
  static async listarTurmasAluno(req, res) {
    try {
      const turmas = await Aluno.getTurmas(req.params.idAluno);
      res.json(turmas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contar total de alunos
  static async contarAlunos(req, res) {
    try {
      const total = await Aluno.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AlunoController;