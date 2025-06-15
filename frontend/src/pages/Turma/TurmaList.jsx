import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TurmaList = () => {
  const [turmas, setTurmas] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTurmas = async () => {
    try {
      const response = await api.get(`/turmas?ativo=${!showInactive}`);
      setTurmas(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      toast.error("Falha ao carregar as turmas.");
    }
  };

  useEffect(() => {
    fetchTurmas();
  }, [showInactive]);

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta turma?')) {
      try {
        await api.patch(`/turmas/${id}/desativar`);
        toast.success("Turma desativada com sucesso!");
        fetchTurmas();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao desativar a turma.");
      }
    }
  };

  const filteredTurmas = turmas.filter(t =>
    (t.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.disciplina_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.professor_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Turmas Cadastradas</h5>
          <div>
            <Link to="/turmas/novo" className="btn btn-primary me-2">
              <i className="bi bi-plus-circle-fill me-2"></i>Nova Turma
            </Link>
            <Link to="/turmas/reativar" className="btn btn-info">
              <i className="bi bi-arrow-counterclockwise me-2"></i>Reativar Turma
            </Link>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  placeholder="Buscar por nome da turma, disciplina ou professor..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativas</label>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Nome</th>
                  <th>Disciplina</th>
                  <th>Professor</th>
                  <th>Dia/Horário</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTurmas.length > 0 ? filteredTurmas.map((turma) => (
                  <tr key={turma.idturma}>
                    <td>{turma.nome}</td>
                    <td>{turma.disciplina_nome}</td>
                    <td>{turma.professor_nome}</td>
                    <td>{turma.dia_semana}, {turma.horario_inicio} - {turma.horario_termino}</td>
                    <td>{turma.local_nome}</td>
                    <td>
                      <span className={`badge ${turma.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>{turma.status}</span>
                    </td>
                    <td className="text-center">
                      <Link to={`/turmas/editar/${turma.idturma}`} className="btn btn-sm btn-warning me-1" title="Editar Turma">
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                      <Link to={`/turmas/${turma.idturma}/alunos`} className="btn btn-sm btn-info me-1" title="Gerenciar Alunos">
                        <i className="bi bi-people-fill"></i>
                      </Link>
                      {turma.status === 'ATIVO' && (
                        <button onClick={() => handleDesativar(turma.idturma)} className="btn btn-sm btn-danger" title="Desativar Turma">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center">Nenhuma turma encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurmaList;