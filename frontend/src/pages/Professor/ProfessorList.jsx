import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ProfessorList = () => {
  const [professores, setProfessores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const fetchProfessores = async () => {
    try {
      const response = await api.get(`/professores?ativo=${!showInactive}`);
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
      toast.error("Falha ao carregar professores.");
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, [showInactive]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  const sortedProfessores = [...professores].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredProfessores = sortedProfessores.filter(prof =>
    prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.cpf.includes(searchTerm)
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este professor?')) {
      try {
        await api.patch(`/professores/${id}/desativar`);
        toast.success("Professor desativado com sucesso!");
        fetchProfessores();
      } catch (error) {
        console.error('Erro ao desativar professor:', error);
        toast.error(error.response?.data?.error || 'Erro ao desativar.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Professores Cadastrados</h5>
          <div>
            <Link to="/professores/novo" className="btn btn-primary me-2">
              <i className="bi bi-plus-circle-fill me-2"></i>Novo Professor
            </Link>
            <Link to="/professores/reativar" className="btn btn-info">
              <i className="bi bi-arrow-counterclockwise me-2"></i>Reativar Professor
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
                  placeholder="Buscar por nome ou CPF..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativos</label>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th onClick={() => requestSort('nome')} style={{ cursor: 'pointer' }}>Nome{getSortIndicator('nome')}</th>
                  <th>CPF</th>
                  <th>Email</th>
                  <th>Titulação</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfessores.length > 0 ? filteredProfessores.map((prof) => (
                  <tr key={prof.idprofessor}>
                    <td>{prof.nome}</td>
                    <td>{prof.cpf}</td>
                    <td>{prof.email}</td>
                    <td>{prof.titulacao}</td>
                    <td>
                      <span className={`badge ${prof.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>
                        {prof.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`/professores/editar/${prof.idprofessor}`} className="btn btn-sm btn-warning me-1" title="Editar">
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                      {prof.status === 'ATIVO' && (
                        <button onClick={() => handleDesativar(prof.idprofessor)} className="btn btn-sm btn-danger" title="Desativar">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center">Nenhum professor encontrado.</td>
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

export default ProfessorList;