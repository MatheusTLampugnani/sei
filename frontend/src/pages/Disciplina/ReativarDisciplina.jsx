import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ReativarDisciplina = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/disciplinas?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas inativas:', error);
      toast.error("Não foi possível carregar as disciplinas inativas.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInativos();
  }, []);

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar esta disciplina?')) {
      try {
        await api.patch(`/disciplinas/${id}/reativar`);
        toast.success("Disciplina reativada com sucesso!");
        fetchInativos();
      } catch (error) {
        console.error('Erro ao reativar disciplina:', error);
        toast.error('Erro ao reativar disciplina.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Reativar Disciplina</h5>
            <button className="btn btn-light btn-sm" onClick={() => navigate('/disciplinas')}>
                <i className="bi bi-arrow-left me-2"></i>Voltar para a Lista
            </button>
        </div>
        <div className="card-body">
            <p>Selecione uma disciplina inativa para reativá-la no sistema.</p>
            {loading ? <p>Carregando...</p> : (
            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-secondary">
                        <tr>
                            <th>Nome</th>
                            <th>Código</th>
                            <th className="text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inativos.length > 0 ? inativos.map(disciplina => (
                            <tr key={disciplina.iddisciplina}>
                                <td>{disciplina.nome}</td>
                                <td>{disciplina.codigo}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleReativar(disciplina.iddisciplina)}
                                    >
                                        <i className="bi bi-check-circle-fill me-2"></i>Reativar
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="text-center">Nenhuma disciplina inativa encontrada.</td>
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

export default ReativarDisciplina;