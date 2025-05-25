const Local = require('../models/Local');

class LocalService {
  static async listarLocais(ativo = true) {
    return Local.findAll(ativo);
  }

  static async obterLocal(id) {
    const local = await Local.findById(id);
    if (!local) {
      throw new Error('Local não encontrado');
    }
    return local;
  }

  static async criarLocal(dados) {
    const nomeExistente = await Local.findByNome(dados.nome);
    if (nomeExistente) {
      throw new Error('Já existe um local com este nome');
    }

    return Local.create(dados);
  }

  static async atualizarLocal(id, dados) {
    const localExistente = await Local.findById(id);
    if (!localExistente) {
      throw new Error('Local não encontrado');
    }

    if (dados.nome && dados.nome !== localExistente.nome) {
      const nomeEmUso = await Local.findByNome(dados.nome);
      if (nomeEmUso) {
        throw new Error('Nome já está em uso por outro local');
      }
    }

    return Local.update(id, dados);
  }

  static async alterarStatusLocal(id, ativo) {
    const local = await Local.findById(id);
    if (!local) {
      throw new Error('Local não encontrado');
    }

    return ativo 
      ? Local.reativar(id)
      : Local.desativar(id);
  }

  static async contarLocais() {
    return Local.count();
  }
}

module.exports = LocalService;