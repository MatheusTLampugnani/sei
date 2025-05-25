import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AlunoList = () => {
  const [alunos, setAlunos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async (showInactive = false) => {
    try {
      const response = await api.get(`/alunos${showInactive ? '?ativo=false' : ''}`);
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
        direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAlunos = [...alunos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredAlunos = sortedAlunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.cpf.includes(searchTerm) ||
    aluno.matricula.includes(searchTerm)
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este aluno?')) {
      try {
        await api.patch(`/alunos/${id}/desativar`);
        fetchAlunos();
      } catch (error) {
        console.error('Erro ao desativar aluno:', error);
        alert('Erro ao desativar. Verifique se o aluno está em turmas ativas.');
      }
    }
  };

  const handleReativarClick = (id) => {
      navigate(`/alunos/reativar/${id}`);
  }


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Alunos</h1>
       <div className="row mb-3">
            <div className="col-md-8">
                <input
                  type="text"
                  placeholder="Buscar aluno por nome, CPF ou matrícula..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="col-md-4 text-end">
                <Link to="/alunos/novo" className="btn btn-primary">
                  Novo Aluno
                </Link>
            </div>
       </div>

      <table className="table table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('nome')}>
              Nome {sortConfig.key === 'nome' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('matricula')}>
              Matrícula {sortConfig.key === 'matricula' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => handleSort('cpf')}>CPF</th>
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
                >
                </Link>
                {aluno.status === 'ATIVO' ? (
                  <button
                    onClick={() => handleDesativar(aluno.idaluno)}
                    className="btn btn-sm btn-danger me-1"
                    title="Desativar"
                  >
                  </button>
                ) : (
                   <button
                        onClick={() => handleReativarClick(aluno.idaluno)}
                        className="btn btn-sm btn-success me-1"
                        title="Reativar"
                    >
                    </button>
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