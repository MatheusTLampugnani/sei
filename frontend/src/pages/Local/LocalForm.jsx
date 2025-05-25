import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const LocalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [local, setLocal] = useState({
    nome: '',
    local: '',
    capacidade: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      api.get(`/locais/${id}`)
        .then(response => setLocal(response.data))
        .catch(error => console.error('Erro ao buscar local:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal({ ...local, [name]: value });
  };

   const validate = () => {
    const newErrors = {};
    if (!local.nome) newErrors.nome = 'Nome é obrigatório'; // [cite: 68]
    if (!local.local) newErrors.local = 'Local (bloco) é obrigatório'; // [cite: 68]
    if (!local.capacidade || local.capacidade <= 0) newErrors.capacidade = 'Capacidade é obrigatória e deve ser positiva'; // [cite: 68]
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (id) {
        await api.put(`/locais/${id}`, local);
      } else {
        await api.post('/locais', local);
      }
      navigate('/locais');
    } catch (error) {
      console.error('Erro ao salvar local:', error);
       alert(error.response?.data?.error || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Editar Local' : 'Novo Local'}</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
         <div className="row g-3">
             <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome (Sala) *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={local.nome} onChange={handleChange} />
                 {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
             <div className="col-md-6">
                <label htmlFor="local" className="form-label">Local (Bloco) *</label>
                <input type="text" className={`form-control ${errors.local ? 'is-invalid' : ''}`} id="local" name="local" value={local.local} onChange={handleChange} />
                 {errors.local && <div className="invalid-feedback">{errors.local}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="capacidade" className="form-label">Capacidade *</label>
                <input type="number" className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`} id="capacidade" name="capacidade" value={local.capacidade} onChange={handleChange} />
                {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
            </div>
         </div>
        <div className="mt-4">
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/locais')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default LocalForm;