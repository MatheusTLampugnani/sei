import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import api from '../../services/api';

const ProfessorList = () => {
  const [professores, setProfessores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false); // Adicionado
  const navigate = useNavigate(); // Adicionado

  useEffect(() => {
    fetchProfessores();
  }, [showInactive]); // Adicionado showInactive como dependência

  const fetchProfessores = async () => {
    try {
      // Modificado para buscar ativos ou todos
      const response = await api.get(`/professores?ativo=${!showInactive}`);
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
    (professor.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (professor.cpf || '').includes(searchTerm)
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
    <div className="container mt-5">
      <h1 className="mb-4">Professores</h1>
      <div className="row mb-3 align-items-center">
            <div className="col-md-6">
                <input
                  type="text"
                  placeholder="Buscar professor por nome ou CPF..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="col-md-2">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showInactive}
                        onChange={() => setShowInactive(!showInactive)}
                        id="showInactiveCheckProf"
                    />
                    <label className="form-check-label" htmlFor="showInactiveCheckProf">
                        Mostrar Inativos
                    </label>
                </div>
            </div>
            <div className="col-md-4 text-end">
                <Link to="/professores/novo" className="btn btn-primary me-2">
                    Novo Professor
                </Link>
                {/* Modificado para link para tela de Reativar */}
                 <Link to="/professores/reativar" className="btn btn-info">
                    Reativar Professor
                </Link>
            </div>
       </div>
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('nome')}>Nome</th>
              <th onClick={() => handleSort('cpf')}>CPF</th>
              <th>Titulação</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfessores.map((professor) => (
              <tr key={professor.idprofessor}> {/* Chave ajustada */}
                <td>{professor.nome}</td>
                <td>{professor.cpf}</td>
                <td>{professor.titulacao}</td>
                <td>{professor.email}</td>
                <td>
                    <span className={`badge ${professor.status === 'ATIVO' ? 'bg-success' : 'bg-danger'}`}>
                        {professor.status}
                    </span>
                </td>
                <td>
                  <Link
                    to={`/professores/editar/${professor.idprofessor}`} // Chave ajustada
                    className="btn btn-sm btn-warning me-1"
                    title="Editar"
                  >
                  </Link>
                  {professor.status === 'ATIVO' ? (
                    <button
                      onClick={() => handleDesativar(professor.idprofessor)} // Chave ajustada
                      className="btn btn-sm btn-danger"
                      title="Desativar"
                    >
                    </button>
                  ) : null }
                </td>
              </tr>
            ))}
             {filteredProfessores.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center">Nenhum professor encontrado.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessorList;