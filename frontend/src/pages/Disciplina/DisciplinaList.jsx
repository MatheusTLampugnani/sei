import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DisciplinaList = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisciplinas();
  }, [showInactive]);

  const fetchDisciplinas = async () => {
    try {
      const response = await api.get(`/disciplinas?ativo=${!showInactive}`);
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedDisciplinas = [...disciplinas].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredDisciplinas = sortedDisciplinas.filter(d =>
    (d.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta disciplina?')) {
      try {
        await api.patch(`/disciplinas/${id}/desativar`);
        fetchDisciplinas();
      } catch (error) {
        console.error('Erro ao desativar disciplina:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Disciplinas</h1>
       <div className="row mb-3 align-items-center">
            <div className="col-md-6">
                <input type="text" placeholder="Buscar por nome ou código..." className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-2">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                    <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativas</label>
                </div>
            </div>
            <div className="col-md-4 text-end">
                <Link to="/disciplinas/novo" className="btn btn-primary me-2">Nova Disciplina</Link>
                <Link to="/disciplinas/reativar" className="btn btn-info">Reativar Disciplina</Link>
            </div>
       </div>
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('nome')}>Nome</th>
            <th onClick={() => handleSort('codigo')}>Código</th>
            <th>Período</th>
            <th>Carga Horária</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredDisciplinas.map((disciplina) => (
            <tr key={disciplina.iddisciplina}>
              <td>{disciplina.nome}</td>
              <td>{disciplina.codigo}</td>
              <td>{disciplina.periodo}</td>
              <td>{disciplina.carga_horaria}</td>
              <td><span className={`badge ${disciplina.status === 'ATIVA' ? 'bg-success' : 'bg-danger'}`}>{disciplina.status}</span></td>
              <td>
                <Link to={`/disciplinas/editar/${disciplina.iddisciplina}`} className="btn btn-sm btn-warning me-1" title="Editar">✏️</Link>
                {disciplina.status === 'ATIVA' && (
                  <button onClick={() => handleDesativar(disciplina.iddisciplina)} className="btn btn-sm btn-danger" title="Desativar">🗑️</button>
                )}
              </td>
            </tr>
          ))}
          {filteredDisciplinas.length === 0 && <tr><td colSpan="6" className="text-center">Nenhuma disciplina encontrada.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default DisciplinaList;