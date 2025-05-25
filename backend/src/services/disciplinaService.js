const Disciplina = require('../models/Disciplina');

class DisciplinaService {
  static async listarDisciplinas(ativo = true) {
    return Disciplina.findAll(ativo);
  }

  static async obterDisciplina(id) {
    const disciplina = await Disciplina.findById(id);
    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }
    return disciplina;
  }

  static async criarDisciplina(dados) {
    if (dados.codigo && dados.codigo.length > 10) {
      throw new Error('Código da disciplina deve ter no máximo 10 caracteres');
    }

    const codigoExistente = await Disciplina.findByCodigo(dados.codigo);
    if (codigoExistente) {
      throw new Error('Código da disciplina já existe');
    }

    return Disciplina.create(dados);
  }

  static async atualizarDisciplina(id, dados) {
    if (dados.codigo && dados.codigo.length > 10) {
      throw new Error('Código da disciplina deve ter no máximo 10 caracteres');
    }

    const disciplinaExistente = await Disciplina.findById(id);
    if (!disciplinaExistente) {
      throw new Error('Disciplina não encontrada');
    }

    if (dados.codigo && dados.codigo !== disciplinaExistente.codigo) {
      const codigoEmUso = await Disciplina.findByCodigo(dados.codigo);
      if (codigoEmUso) {
        throw new Error('Código já está em uso por outra disciplina');
      }
    }

    return Disciplina.update(id, dados);
  }

  static async alterarStatusDisciplina(id, ativo) {
    const disciplina = await Disciplina.findById(id);
    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    return ativo 
      ? Disciplina.reativar(id)
      : Disciplina.desativar(id);
  }

  static async contarDisciplinas() {
    return Disciplina.count();
  }
}

module.exports = DisciplinaService;