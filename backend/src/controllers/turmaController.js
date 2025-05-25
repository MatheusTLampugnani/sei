const Turma = require('../models/Turma');
const TurmaAluno = require('../models/TurmaAluno');

class TurmaController {
  // Listar todas as turmas
  static async listarTurmas(req, res) {
    try {
      const ativo = req.query.ativo !== 'false'; // default true
      const turmas = await Turma.findAll(ativo);
      res.json(turmas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obter uma turma por ID
  static async obterTurma(req, res) {
    try {
      const turma = await Turma.findById(req.params.id);
      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      res.json(turma);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Criar uma nova turma
  static async criarTurma(req, res) {
    try {
      const novaTurma = await Turma.create(req.body);
      res.status(201).json(novaTurma);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Atualizar uma turma
  static async atualizarTurma(req, res) {
    try {
      const turmaExistente = await Turma.findById(req.params.id);
      if (!turmaExistente) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      const turmaAtualizada = await Turma.update(req.params.id, req.body);
      res.json(turmaAtualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Desativar uma turma
  static async desativarTurma(req, res) {
    try {
      const turmaDesativada = await Turma.desativar(req.params.id);
      if (!turmaDesativada) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      res.json(turmaDesativada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reativar uma turma
  static async reativarTurma(req, res) {
    try {
      const turmaReativada = await Turma.reativar(req.params.id);
      if (!turmaReativada) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      res.json(turmaReativada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Adicionar aluno a turma
  static async adicionarAluno(req, res) {
    try {
      const turmaAluno = await TurmaAluno.addAluno(req.params.idTurma, req.params.idAluno);
      res.status(201).json(turmaAluno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Remover aluno da turma
  static async removerAluno(req, res) {
    try {
      const turmaAluno = await TurmaAluno.removeAluno(req.params.idTurma, req.params.idAluno);
      if (!turmaAluno) {
        return res.status(404).json({ error: 'Aluno não encontrado na turma' });
      }
      res.json(turmaAluno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar alunos de uma turma
  static async listarAlunosTurma(req, res) {
    try {
      const alunos = await TurmaAluno.getAlunosByTurma(req.params.idTurma);
      res.json(alunos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contar total de turmas
  static async contarTurmas(req, res) {
    try {
      const total = await Turma.count();
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TurmaController;