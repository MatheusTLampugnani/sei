import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ReativarAluno = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos inativos:', error);
      toast.error("Não foi possível carregar os alunos inativos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInativos();
  }, []);

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este aluno?')) {
      try {
        await api.patch(`/alunos/${id}/reativar`);
        toast.success("Aluno reativado com sucesso!");
        fetchInativos();
      } catch (error) {
        console.error('Erro ao reativar aluno:', error);
        toast.error('Erro ao reativar aluno.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Reativar Aluno</h5>
            <button className="btn btn-light btn-sm" onClick={() => navigate('/alunos')}>
                <i className="bi bi-arrow-left me-2"></i>Voltar para a Lista
            </button>
        </div>
        <div className="card-body">
            <p>Selecione um aluno inativo para reativá-lo no sistema.</p>
            {loading ? <p>Carregando...</p> : (
            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-secondary">
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Matrícula</th>
                            <th className="text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inativos.length > 0 ? inativos.map(aluno => (
                            <tr key={aluno.idaluno}>
                                <td>{aluno.nome}</td>
                                <td>{aluno.cpf}</td>
                                <td>{aluno.matricula}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleReativar(aluno.idaluno)}
                                    >
                                        <i className="bi bi-check-circle-fill me-2"></i>Reativar
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center">Nenhum aluno inativo encontrado.</td>
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

export default ReativarAluno;