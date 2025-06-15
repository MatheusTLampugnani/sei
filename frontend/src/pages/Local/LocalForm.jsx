import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const LocalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [local, setLocal] = useState({
    nome: '',
    local: '',
    capacidade: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      api.get(`/locais/${id}`)
        .then(response => setLocal(response.data))
        .catch(error => {
            console.error('Erro ao buscar local:', error);
            toast.error("Não foi possível carregar os dados do local.");
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal({ ...local, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!local.nome) newErrors.nome = 'Nome é obrigatório.';
    if (!local.local) newErrors.local = 'Local (bloco) é obrigatório.';
    if (!local.capacidade || local.capacidade <= 0) newErrors.capacidade = 'Capacidade é obrigatória e deve ser um número positivo.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      if (id) {
        await api.put(`/locais/${id}`, local);
        toast.success("Local atualizado com sucesso!");
      } else {
        await api.post('/locais', local);
        toast.success("Local criado com sucesso!");
      }
      navigate('/locais');
    } catch (error) {
       const errorMessage = error.response?.data?.error || 'Ocorreu um erro inesperado.';
       console.error('Erro ao salvar local:', errorMessage, error);
       toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">{isEditing ? 'Editar Local' : 'Novo Local'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome (Ex: Sala 101) *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={local.nome} onChange={handleChange} required />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="local" className="form-label">Local (Ex: Bloco A) *</label>
                <input type="text" className={`form-control ${errors.local ? 'is-invalid' : ''}`} id="local" name="local" value={local.local} onChange={handleChange} required />
                {errors.local && <div className="invalid-feedback">{errors.local}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="capacidade" className="form-label">Capacidade *</label>
                <input type="number" className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} id="capacidade" name="capacidade" value={local.capacidade || ''} onChange={handleChange} min="1" required />
                {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 text-end mt-4 p-0">
                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/locais')}>
                    <i className="bi bi-x-lg me-2"></i>Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-lg me-2"></i>Salvar
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocalForm;