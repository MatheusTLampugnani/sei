const Aluno = require('../models/Aluno');
const { validarCPF } = require('../utils/validators');

class AlunoService {
  static async listarAlunos(ativo = true) {
    return Aluno.findAll(ativo);
  }

  static async obterAluno(id) {
    const aluno = await Aluno.findById(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    return aluno;
  }

  static async criarAluno(dados) {
    if (!validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }
    
    const cpfExistente = await Aluno.findByCpf(dados.cpf);
    if (cpfExistente) {
      throw new Error('CPF já cadastrado');
    }

    const matriculaExistente = await Aluno.findByMatricula(dados.matricula);
    if (matriculaExistente) {
      throw new Error('Matrícula já cadastrada');
    }

    return Aluno.create(dados);
  }

  static async atualizarAluno(id, dados) {
    if (dados.cpf && !validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }

    const alunoExistente = await Aluno.findById(id);
    if (!alunoExistente) {
      throw new Error('Aluno não encontrado');
    }

    if (dados.cpf && dados.cpf !== alunoExistente.cpf) {
      const cpfEmUso = await Aluno.findByCpf(dados.cpf);
      if (cpfEmUso) {
        throw new Error('CPF já está em uso por outro aluno');
      }
    }

    if (dados.matricula && dados.matricula !== alunoExistente.matricula) {
      const matriculaEmUso = await Aluno.findByMatricula(dados.matricula);
      if (matriculaEmUso) {
        throw new Error('Matrícula já está em uso por outro aluno');
      }
    }

    return Aluno.update(id, dados);
  }

  static async alterarStatusAluno(id, ativo) {
    const aluno = await Aluno.findById(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    return ativo 
      ? Aluno.reativar(id)
      : Aluno.desativar(id);
  }

  static async listarTurmasAluno(idAluno) {
    return Aluno.getTurmas(idAluno);
  }

  static async contarAlunos() {
    return Aluno.count();
  }
}

module.exports = AlunoService;