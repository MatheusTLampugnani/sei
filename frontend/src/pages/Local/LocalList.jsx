import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const LocalList = () => {
  const [locais, setLocais] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLocais = async () => {
    try {
      const response = await api.get(`/locais?ativo=${!showInactive}`);
      setLocais(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      toast.error("Falha ao carregar locais.");
    }
  };

  useEffect(() => {
    fetchLocais();
  }, [showInactive]);

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este local?')) {
      try {
        await api.patch(`/locais/${id}/desativar`);
        toast.success("Local desativado com sucesso!");
        fetchLocais();
      } catch (error) {
        toast.error(error.response?.data?.error || "Erro ao desativar.");
      }
    }
  };

  const filteredLocais = locais.filter(l =>
    (l.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (l.local?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Locais (Salas) Cadastrados</h5>
          <div>
            <Link to="/locais/novo" className="btn btn-primary me-2">
              <i className="bi bi-plus-circle-fill me-2"></i>Novo Local
            </Link>
            <Link to="/locais/reativar" className="btn btn-info">
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
                  placeholder="Buscar por nome da sala ou bloco..."
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
                  <th>Nome (Sala)</th>
                  <th>Local (Bloco)</th>
                  <th>Capacidade</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocais.length > 0 ? filteredLocais.map((local) => (
                  <tr key={local.idlocal}>
                    <td>{local.nome}</td>
                    <td>{local.local}</td>
                    <td>{local.capacidade}</td>
                    <td>
                      <span className={`badge ${local.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>
                        {local.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link to={`/locais/editar/${local.idlocal}`} className="btn btn-sm btn-warning me-1" title="Editar">
                        <i className="bi bi-pencil-fill"></i>
                      </Link>
                      {local.status === 'ATIVO' && (
                        <button onClick={() => handleDesativar(local.idlocal)} className="btn btn-sm btn-danger" title="Desativar">
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center">Nenhum local encontrado.</td>
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

export default LocalList;