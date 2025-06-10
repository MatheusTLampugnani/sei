const Turma = require('../models/Turma');
const TurmaAluno = require('../models/TurmaAluno');
const Disciplina = require('../models/Disciplina');
const Professor = require('../models/Professor');
const Local = require('../models/Local');

class TurmaService {
  static async listarTurmas(ativo = true) {
    return Turma.findAll(ativo);
  }

  static async obterTurma(id) {
    const turma = await Turma.findById(id);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }
    return turma;
  }

  static async criarTurma(dados) {
    // Verifica se a disciplina existe
    const disciplina = await Disciplina.findById(dados.idDisciplina);
    if (!disciplina || disciplina.status !== 'ATIVA') {
      throw new Error('Disciplina não encontrada ou inativa');
    }

    // Verifica se o professor existe
    const professor = await Professor.findById(dados.idProfessor);
    if (!professor || professor.status !== 'ATIVO') {
      throw new Error('Professor não encontrado ou inativo');
    }

    // Verifica se o local existe
    const local = await Local.findById(dados.idLocal);
    if (!local || local.status !== 'ATIVO') {
      throw new Error('Local não encontrado ou inativo');
    }

    // VERIFICAÇÃO DE CONFLITO
    const conflito = await Turma.checkConflito(dados.idLocal, dados.dia_semana, dados.horario_inicio, dados.horario_termino);
    if (conflito) {
      throw new Error(`Conflito de horário: Já existe a turma "${conflito.nome}" neste local e horário.`);
    }

    return Turma.create(dados);
  }

  static async atualizarTurma(id, dados) {
    const turmaExistente = await Turma.findById(id);
    if (!turmaExistente) {
      throw new Error('Turma não encontrada');
    }

    if (dados.idDisciplina) {
      const disciplina = await Disciplina.findById(dados.idDisciplina);
      if (!disciplina || disciplina.status !== 'ATIVA') {
        throw new Error('Disciplina não encontrada ou inativa');
      }
    }

    if (dados.idProfessor) {
      const professor = await Professor.findById(dados.idProfessor);
      if (!professor || professor.status !== 'ATIVO') {
        throw new Error('Professor não encontrado ou inativo');
      }
    }

    if (dados.idLocal) {
      const local = await Local.findById(dados.idLocal);
      if (!local || local.status !== 'ATIVO') {
        throw new Error('Local não encontrado ou inativo');
      }
    }

    // VERIFICAÇÃO DE CONFLITO
    const conflito = await Turma.checkConflito(dados.idLocal, dados.dia_semana, dados.horario_inicio, dados.horario_termino, id);
    if (conflito) {
        throw new Error(`Conflito de horário: Já existe a turma "${conflito.nome}" neste local e horário.`);
    }

    return Turma.update(id, dados);
  }

  static async alterarStatusTurma(id, ativo) {
    const turma = await Turma.findById(id);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    return ativo
      ? Turma.reativar(id)
      : Turma.desativar(id);
  }

  static async adicionarAluno(idTurma, idAluno) {
    const alunoNaTurma = await TurmaAluno.checkAlunoInTurma(idTurma, idAluno);
    if (alunoNaTurma) {
      throw new Error('Aluno já está matriculado nesta turma');
    }

    return TurmaAluno.addAluno(idTurma, idAluno);
  }

  static async removerAluno(idTurma, idAluno) {
    const alunoNaTurma = await TurmaAluno.checkAlunoInTurma(idTurma, idAluno);
    if (!alunoNaTurma) {
      throw new Error('Aluno não está matriculado nesta turma');
    }

    return TurmaAluno.removeAluno(idTurma, idAluno);
  }

  static async listarAlunosTurma(idTurma) {
    return TurmaAluno.getAlunosByTurma(idTurma);
  }

  static async contarTurmas() {
    return Turma.count();
  }
}

module.exports = TurmaService;