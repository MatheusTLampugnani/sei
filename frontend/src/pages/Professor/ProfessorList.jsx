import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ProfessorList = () => {
  const [professores, setProfessores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await api.get('/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProfessores = [...professores].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProfessores = sortedProfessores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.cpf.includes(searchTerm)
  );

  const handleDesativar = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este professor?')) {
      try {
        await api.patch(`/professores/${id}/desativar`);
        fetchProfessores();
      } catch (error) {
        console.error('Erro ao desativar professor:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Professores</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar professor..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Link to="/professores/novo" className="btn btn-primary mb-3">
        Novo Professor
      </Link>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th onClick={() => handleSort('nome')}>
                Nome {sortConfig.key === 'nome' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th onClick={() => handleSort('cpf')}>
                CPF {sortConfig.key === 'cpf' && (
                  sortConfig.direction === 'ascending' ? '↑' : '↓'
                )}
              </th>
              <th>Titulação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.map((professor) => (
              <tr key={professor.idProfessor}>
                <td>{professor.nome}</td>
                <td>{professor.cpf}</td>
                <td>{professor.titulacao}</td>
                <td>{professor.status}</td>
                <td>
                  <Link
                    to={`/professores/editar/${professor.idProfessor}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Editar
                  </Link>
                  {professor.status === 'ATIVO' ? (
                    <button
                      onClick={() => handleDesativar(professor.idProfessor)}
                      className="btn btn-sm btn-danger me-2"
                    >
                      Desativar
                    </button>
                  ) : (
                    <Link
                      to={`/professores/reativar/${professor.idProfessor}`}
                      className="btn btn-sm btn-success me-2"
                    >
                      Reativar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorList;