import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ReativarProfessor = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/professores?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores inativos:', error);
      toast.error("Não foi possível carregar os professores inativos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInativos();
  }, []);

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este professor?')) {
      try {
        await api.patch(`/professores/${id}/reativar`);
        toast.success("Professor reativado com sucesso!");
        fetchInativos();
      } catch (error) {
        console.error('Erro ao reativar professor:', error);
        toast.error('Erro ao reativar professor.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Reativar Professor</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/professores')}>
            <i className="bi bi-arrow-left me-2"></i>Voltar para a Lista
          </button>
        </div>
        <div className="card-body">
          <p>Selecione um professor inativo para reativá-lo no sistema.</p>
          {loading ? <p>Carregando...</p> : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Titulação</th>
                    <th className="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {inativos.length > 0 ? inativos.map(prof => (
                    <tr key={prof.idprofessor}>
                      <td>{prof.nome}</td>
                      <td>{prof.cpf}</td>
                      <td>{prof.titulacao}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReativar(prof.idprofessor)}
                        >
                          <i className="bi bi-check-circle-fill me-2"></i>Reativar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center">Nenhum professor inativo encontrado.</td>
                    </tr>
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

export default ReativarProfessor;