import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReativarDisciplina = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInativos();
  }, []);

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/disciplinas?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas inativas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar esta disciplina?')) {
      try {
        await api.patch(`/disciplinas/${id}/reativar`);
        fetchInativos(); // Atualiza a lista
      } catch (error) {
        console.error('Erro ao reativar disciplina:', error);
        alert('Erro ao reativar disciplina.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reativar Disciplina</h1>
       <button className="btn btn-secondary mb-3" onClick={() => navigate('/disciplinas')}>
            Voltar para a Lista
        </button>
      {loading ? <p>Carregando...</p> : (
        <table className="table table-hover table-bordered">
            <thead className="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>Código</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {inativos.length > 0 ? inativos.map(disciplina => (
                    <tr key={disciplina.iddisciplina}>
                        <td>{disciplina.nome}</td>
                        <td>{disciplina.codigo}</td>
                        <td>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleReativar(disciplina.iddisciplina)}
                            >
                                Reativar
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
      )}
    </div>
  );
};

export default ReativarDisciplina;