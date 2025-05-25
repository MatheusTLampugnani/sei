import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReativarAluno = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInativos();
  }, []);

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/alunos?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos inativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este aluno?')) {
      try {
        await api.patch(`/alunos/${id}/reativar`);
        fetchInativos(); // Atualiza a lista
      } catch (error) {
        console.error('Erro ao reativar aluno:', error);
        alert('Erro ao reativar aluno.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reativar Aluno</h1>
      <p>Selecione um aluno inativo para reativá-lo no sistema.</p>
       <button className="btn btn-secondary mb-3" onClick={() => navigate('/alunos')}>
            Voltar para a Lista
        </button>
      {loading ? <p>Carregando...</p> : (
        <table className="table table-hover table-bordered">
            <thead className="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Matrícula</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {inativos.length > 0 ? inativos.map(aluno => (
                    <tr key={aluno.idaluno}>
                        <td>{aluno.nome}</td>
                        <td>{aluno.cpf}</td>
                        <td>{aluno.matricula}</td>
                        <td>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleReativar(aluno.idaluno)}
                            >
                                Reativar
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
      )}
    </div>
  );
};

export default ReativarAluno;