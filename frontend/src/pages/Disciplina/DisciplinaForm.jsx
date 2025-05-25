import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const DisciplinaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [disciplina, setDisciplina] = useState({
    nome: '',
    codigo: '',
    periodo: '',
    carga_horaria: '',
    modalidade: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      api.get(`/disciplinas/${id}`)
        .then(response => setDisciplina(response.data))
        .catch(error => console.error('Erro ao buscar disciplina:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisciplina({ ...disciplina, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!disciplina.nome) newErrors.nome = 'Nome é obrigatório'; // [cite: 68]
    if (!disciplina.codigo) newErrors.codigo = 'Código é obrigatório'; // [cite: 68]
    if (disciplina.codigo && disciplina.codigo.length > 10) newErrors.codigo = 'Código deve ter no máximo 10 caracteres'; // [cite: 68]
    if (!disciplina.periodo) newErrors.periodo = 'Período é obrigatório'; // [cite: 68]
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
        await api.put(`/disciplinas/${id}`, disciplina);
      } else {
        await api.post('/disciplinas', disciplina);
      }
      navigate('/disciplinas');
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
      alert(error.response?.data?.error || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Editar Disciplina' : 'Nova Disciplina'}</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
         <div className="row g-3">
            <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={disciplina.nome} onChange={handleChange} />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="codigo" className="form-label">Código *</label>
                <input type="text" className={`form-control ${errors.codigo ? 'is-invalid' : ''}`} id="codigo" name="codigo" value={disciplina.codigo} onChange={handleChange} maxLength="10" />
                {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
            </div>
             <div className="col-md-6">
                <label htmlFor="periodo" className="form-label">Período *</label>
                <input type="text" className={`form-control ${errors.periodo ? 'is-invalid' : ''}`} id="periodo" name="periodo" value={disciplina.periodo} onChange={handleChange} placeholder="Ex: 2025.1" />
                {errors.periodo && <div className="invalid-feedback">{errors.periodo}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="carga_horaria" className="form-label">Carga Horária</label>
                <input type="number" className="form-control" id="carga_horaria" name="carga_horaria" value={disciplina.carga_horaria} onChange={handleChange} />
            </div>
             <div className="col-md-6">
                <label htmlFor="modalidade" className="form-label">Modalidade</label>
                <input type="text" className="form-control" id="modalidade" name="modalidade" value={disciplina.modalidade} onChange={handleChange} placeholder="Ex: Presencial, EAD" />
            </div>
        </div>
        <div className="mt-4">
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/disciplinas')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default DisciplinaForm;