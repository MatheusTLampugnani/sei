import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReativarProfessor = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInativos();
  }, []);

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/professores?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar professores inativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este professor?')) {
      try {
        await api.patch(`/professores/${id}/reativar`);
        fetchInativos(); // Atualiza a lista após reativar
      } catch (error) {
        console.error('Erro ao reativar professor:', error);
        alert('Erro ao reativar professor.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reativar Professor</h1>
      <p>Selecione um professor inativo para reativá-lo no sistema.</p>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/professores')}>
            Voltar para a Lista
      </button>

      {loading ? <p>Carregando...</p> : (
        <table className="table table-hover table-bordered">
            <thead className="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Titulação</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {inativos.length > 0 ? inativos.map(prof => (
                    <tr key={prof.idprofessor}>
                        <td>{prof.nome}</td>
                        <td>{prof.cpf}</td>
                        <td>{prof.titulacao}</td>
                        <td>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleReativar(prof.idprofessor)}
                            >
                                Reativar
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
      )}
    </div>
  );
};

export default ReativarProfessor;