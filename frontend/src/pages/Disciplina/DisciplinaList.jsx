import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DisciplinaList = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDisciplinas = async () => {
    try {
      const response = await api.get(`/disciplinas?ativo=${!showInactive}`);
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
      toast.error("Falha ao carregar disciplinas.");
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, [showInactive]);

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta disciplina?')) {
      try {
        await api.patch(`/disciplinas/${id}/desativar`);
        toast.success("Disciplina desativada com sucesso!");
        fetchDisciplinas();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao desativar.");
      }
    }
  };

  const filteredDisciplinas = disciplinas.filter(d =>
    (d.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Disciplinas Cadastradas</h5>
          <div>
            <Link to="/disciplinas/novo" className="btn btn-primary me-2">
              <i className="bi bi-plus-circle-fill me-2"></i>Nova Disciplina
            </Link>
            <Link to="/disciplinas/reativar" className="btn btn-info">
              <i className="bi bi-arrow-counterclockwise me-2"></i>Reativar
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
                  placeholder="Buscar por nome ou código..."
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
                  <th>Código</th>
                  <th>Período</th>
                  <th>Carga H.</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisciplinas.length > 0 ? filteredDisciplinas.map((disciplina) => (
                  <tr key={disciplina.iddisciplina}>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.codigo}</td>
                    <td>{disciplina.periodo}</td>
                    <td>{disciplina.carga_horaria}h</td>
                    <td>
                      <span className={`badge ${disciplina.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>
                        {disciplina.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`/disciplinas/editar/${disciplina.iddisciplina}`} className="btn btn-sm btn-warning me-1" title="Editar">
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                      {disciplina.status === 'ATIVO' && (
                        <button onClick={() => handleDesativar(disciplina.iddisciplina)} className="btn btn-sm btn-danger" title="Desativar">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center">Nenhuma disciplina encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplinaList;