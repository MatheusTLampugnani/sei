import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ReativarTurma = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInativos();
  }, []);

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/turmas?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar turmas inativas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar esta turma?')) {
      try {
        await api.patch(`/turmas/${id}/reativar`);
        fetchInativos();
      } catch (error) {
        console.error('Erro ao reativar turma:', error);
        alert('Erro ao reativar turma.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Reativar Turma</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/turmas')}>
            <i className="bi bi-arrow-left me-2"></i>Voltar para a Lista
          </button>
        </div>
        <div className="card-body">
          {loading ? <p>Carregando...</p> : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Nome da Turma</th>
                    <th>Disciplina</th>
                    <th>Professor</th>
                    <th className="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {inativos.length > 0 ? inativos.map(turma => (
                    <tr key={turma.idturma}>
                      <td>{turma.nome}</td>
                      <td>{turma.disciplina_nome}</td>
                      <td>{turma.professor_nome}</td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm" onClick={() => handleReativar(turma.idturma)}>
                          <i className="bi bi-check-circle-fill me-2"></i>Reativar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center">Nenhuma turma inativa encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReativarTurma;
