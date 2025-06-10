import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AlunoList = () => {
  const [alunos, setAlunos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  const fetchAlunos = async () => {
    try {
      const response = await api.get(`/alunos?ativo=${!showInactive}`);
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error("Falha ao buscar alunos.");
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, [showInactive]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
       // Opcional: Desativar ordenação ao clicar 3x
       // setSortConfig({ key: null, direction: null });
       // return;
       direction = 'ascending'; // Ou voltar para ascendente
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  }

  const sortedAlunos = useMemo(() => {
    let sortableItems = [...alunos];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [alunos, sortConfig]);


  const filteredAlunos = sortedAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.cpf.includes(searchTerm) ||
    aluno.matricula.includes(searchTerm)
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este aluno?')) {
      try {
        await api.patch(`/alunos/${id}/desativar`);
        toast.success("Aluno desativado com sucesso!");
        fetchAlunos();
      } catch (error) {
        console.error('Erro ao desativar aluno:', error);
        toast.error(error.response?.data?.error || 'Erro ao desativar. Verifique as dependências.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Alunos</h1>
       <div className="row mb-3 align-items-center">
            <div className="col-md-5">
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou matrícula..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="col-md-3">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} id="showInactiveCheck" />
                    <label className="form-check-label" htmlFor="showInactiveCheck">Mostrar Inativos</label>
                </div>
            </div>
            <div className="col-md-4 text-end">
                <Link to="/alunos/novo" className="btn btn-primary me-2">Novo Aluno</Link>
                <Link to="/alunos/reativar" className="btn btn-info">Reativar Aluno</Link>
            </div>
       </div>

      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => requestSort('nome')} style={{cursor: 'pointer'}}>
              Nome{getSortIndicator('nome')}
            </th>
            <th onClick={() => requestSort('matricula')} style={{cursor: 'pointer'}}>
              Matrícula{getSortIndicator('matricula')}
            </th>
            <th>CPF</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlunos.map((aluno) => (
            <tr key={aluno.idaluno} className={aluno.status !== 'ATIVO' ? 'table-secondary' : ''}>
              <td>{aluno.nome}</td>
              <td>{aluno.matricula}</td>
              <td>{aluno.cpf}</td>
              <td>
                  <span className={`badge ${aluno.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>
                      {aluno.status}
                  </span>
              </td>
              <td>
                <Link
                  to={`/alunos/editar/${aluno.idaluno}`}
                  className="btn btn-sm btn-warning me-1"
                  title="Editar"
                >✏️</Link>
                {aluno.status === 'ATIVO' && (
                  <button
                    onClick={() => handleDesativar(aluno.idaluno)}
                    className="btn btn-sm btn-danger me-1"
                    title="Desativar"
                  >🗑️</button>
                )}
              </td>
            </tr>
          ))}
           {filteredAlunos.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center">Nenhum aluno encontrado.</td>
                </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

export default AlunoList;