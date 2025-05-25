import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LocalList = () => {
  const [locais, setLocais] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocais();
  }, [showInactive]);

  const fetchLocais = async () => {
    try {
      const response = await api.get(`/locais?ativo=${!showInactive}`);
      setLocais(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
    }
  };

   const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLocais = [...locais].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredLocais = sortedLocais.filter(l =>
    (l.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (l.local?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este local?')) {
      try {
        await api.patch(`/locais/${id}/desativar`);
        fetchLocais();
      } catch (error) {
        console.error('Erro ao desativar local:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Locais (Salas)</h1>
        <div className="row mb-3 align-items-center">
            <div className="col-md-6">
                <input type="text" placeholder="Buscar por nome ou local..." className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-2">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                    <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativos</label>
                </div>
            </div>
            <div className="col-md-4 text-end">
                <Link to="/locais/novo" className="btn btn-primary me-2">Novo Local</Link>
                <Link to="/locais/reativar" className="btn btn-info">Reativar Local</Link>
            </div>
       </div>
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('nome')}>Nome (Sala)</th>
            <th onClick={() => handleSort('local')}>Local (Bloco)</th>
            <th>Capacidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredLocais.map((local) => (
            <tr key={local.idlocal}>
              <td>{local.nome}</td>
              <td>{local.local}</td>
              <td>{local.capacidade}</td>
              <td><span className={`badge ${local.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>{local.status}</span></td>
              <td>
                <Link to={`/locais/editar/${local.idlocal}`} className="btn btn-sm btn-warning me-1" title="Editar">✏️</Link>
                {local.status === 'ATIVO' && (
                    <button onClick={() => handleDesativar(local.idlocal)} className="btn btn-sm btn-danger" title="Desativar">🗑️</button>
                )}
              </td>
            </tr>
          ))}
           {filteredLocais.length === 0 && <tr><td colSpan="5" className="text-center">Nenhum local encontrado.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default LocalList;