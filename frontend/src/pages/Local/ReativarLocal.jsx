import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReativarLocal = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInativos();
  }, []);

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/locais?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais inativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este local?')) {
      try {
        await api.patch(`/locais/${id}/reativar`);
        fetchInativos();
      } catch (error) {
        console.error('Erro ao reativar local:', error);
        alert('Erro ao reativar local.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reativar Local</h1>
       <button className="btn btn-secondary mb-3" onClick={() => navigate('/locais')}>
            Voltar para a Lista
        </button>
      {loading ? <p>Carregando...</p> : (
        <table className="table table-hover table-bordered">
            <thead className="table-dark">
                <tr><th>Nome</th><th>Local</th><th>Ação</th></tr>
            </thead>
            <tbody>
                {inativos.length > 0 ? inativos.map(local => (
                    <tr key={local.idlocal}>
                        <td>{local.nome}</td>
                        <td>{local.local}</td>
                        <td>
                            <button className="btn btn-success btn-sm" onClick={() => handleReativar(local.idlocal)}>
                                Reativar
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" className="text-center">Nenhum local inativo encontrado.</td></tr>
                )}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default ReativarLocal;