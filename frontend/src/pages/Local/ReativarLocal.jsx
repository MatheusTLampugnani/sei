import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ReativarLocal = () => {
  const [inativos, setInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInativos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/locais?ativo=false');
      setInativos(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais inativos:', error);
      toast.error("Não foi possível carregar os locais inativos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInativos();
  }, []);

  const handleReativar = async (id) => {
    if (window.confirm('Tem certeza que deseja reativar este local?')) {
      try {
        await api.patch(`/locais/${id}/reativar`);
        toast.success("Local reativado com sucesso!");
        fetchInativos();
      } catch (error) {
        toast.error('Erro ao reativar local.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Reativar Local</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate('/locais')}>
            <i className="bi bi-arrow-left me-2"></i>Voltar para a Lista
          </button>
        </div>
        <div className="card-body">
          <p>Selecione um local inativo para reativá-lo no sistema.</p>
          {loading ? <p>Carregando...</p> : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>Nome (Sala)</th>
                    <th>Local (Bloco)</th>
                    <th className="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {inativos.length > 0 ? inativos.map(local => (
                    <tr key={local.idlocal}>
                      <td>{local.nome}</td>
                      <td>{local.local}</td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm" onClick={() => handleReativar(local.idlocal)}>
                          <i className="bi bi-check-circle-fill me-2"></i>Reativar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="text-center">Nenhum local inativo encontrado.</td>
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

export default ReativarLocal;