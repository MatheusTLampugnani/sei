const Professor = require('../models/Professor');
const { validarCPF } = require('../utils/validators');

class ProfessorService {
  static async listarProfessores(ativo = true) {
    return Professor.findAll(ativo);
  }

  static async obterProfessor(id) {
    const professor = await Professor.findById(id);
    if (!professor) {
      throw new Error('Professor não encontrado');
    }
    return professor;
  }

  static async criarProfessor(dados) {
    if (!validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }

    const cpfExistente = await Professor.findByCpf(dados.cpf);
    if (cpfExistente) {
      throw new Error('CPF já cadastrado');
    }

    return Professor.create(dados);
  }

  static async atualizarProfessor(id, dados) {
    if (dados.cpf && !validarCPF(dados.cpf)) {
      throw new Error('CPF inválido');
    }

    const professorExistente = await Professor.findById(id);
    if (!professorExistente) {
      throw new Error('Professor não encontrado');
    }

    if (dados.cpf && dados.cpf !== professorExistente.cpf) {
      const cpfEmUso = await Professor.findByCpf(dados.cpf);
      if (cpfEmUso) {
        throw new Error('CPF já está em uso por outro professor');
      }
    }

    return Professor.update(id, dados);
  }

  static async alterarStatusProfessor(id, ativo) {
    const professor = await Professor.findById(id);
    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    return ativo 
      ? Professor.reativar(id)
      : Professor.desativar(id);
  }

  static async contarProfessores() {
    return Professor.count();
  }
}

module.exports = ProfessorService;