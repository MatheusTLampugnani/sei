import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TurmaList = () => {
  const [turmas, setTurmas] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTurmas();
  }, [showInactive]);

  const fetchTurmas = async () => {
    try {
      const response = await api.get(`/turmas?ativo=${!showInactive}`);
      setTurmas(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTurmas = [...turmas].sort((a, b) => {
     const key = sortConfig.key;
     const valA = a[key] ? a[key].toString().toLowerCase() : '';
     const valB = b[key] ? b[key].toString().toLowerCase() : '';

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredTurmas = sortedTurmas.filter(t =>
    (t.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.disciplina_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (t.professor_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta turma?')) {
      try {
        await api.patch(`/turmas/${id}/desativar`);
        fetchTurmas();
      } catch (error) {
        console.error('Erro ao desativar turma:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Turmas</h1>
       <div className="row mb-3 align-items-center">
            <div className="col-md-6">
                <input type="text" placeholder="Buscar por nome, disciplina ou professor..." className="form-control" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-2">
                 <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                    <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativas</label>
                </div>
            </div>
            <div className="col-md-4 text-end">
                <Link to="/turmas/novo" className="btn btn-primary me-2">Nova Turma</Link>
                <Link to="/turmas/reativar" className="btn btn-info">Reativar Turma</Link>
            </div>
       </div>
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('nome')}>Nome</th>
            <th onClick={() => handleSort('disciplina_nome')}>Disciplina</th>
            <th onClick={() => handleSort('professor_nome')}>Professor</th>
            <th>Dia/Horário</th>
            <th>Local</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredTurmas.map((turma) => (
            <tr key={turma.idturma}>
              <td>{turma.nome}</td>
              <td>{turma.disciplina_nome}</td>
              <td>{turma.professor_nome}</td>
              <td>{turma.dia_semana} {turma.horario_inicio} - {turma.horario_termino}</td>
              <td>{turma.local_nome}</td>
              <td><span className={`badge ${turma.status === 'ATIVA' ? 'bg-success' : 'bg-danger'}`}>{turma.status}</span></td>
              <td>
                <Link to={`/turmas/editar/${turma.idturma}`} className="btn btn-sm btn-warning me-1" title="Editar">✏️</Link>
                 {turma.status === 'ATIVA' && (
                    <button onClick={() => handleDesativar(turma.idturma)} className="btn btn-sm btn-danger" title="Desativar">🗑️</button>
                 )}
              </td>
            </tr>
          ))}
           {filteredTurmas.length === 0 && <tr><td colSpan="7" className="text-center">Nenhuma turma encontrada.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default TurmaList;