import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
      <h1 className="mb-4">Reativar Turma</h1>
       <button className="btn btn-secondary mb-3" onClick={() => navigate('/turmas')}>
            Voltar para a Lista
        </button>
      {loading ? <p>Carregando...</p> : (
        <table className="table table-hover table-bordered">
            <thead className="table-dark">
                <tr><th>Nome</th><th>Disciplina</th><th>Professor</th><th>Ação</th></tr>
            </thead>
            <tbody>
                {inativos.length > 0 ? inativos.map(turma => (
                    <tr key={turma.idturma}>
                        <td>{turma.nome}</td>
                        <td>{turma.disciplina_nome}</td>
                        <td>{turma.professor_nome}</td>
                        <td>
                            <button className="btn btn-success btn-sm" onClick={() => handleReativar(turma.idturma)}>
                                Reativar
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="4" className="text-center">Nenhuma turma inativa encontrada.</td></tr>
                )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default ReativarTurma;