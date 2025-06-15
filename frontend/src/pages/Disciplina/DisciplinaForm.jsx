import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const DisciplinaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [disciplina, setDisciplina] = useState({
    nome: '',
    codigo: '',
    periodo: '',
    carga_horaria: '',
    modalidade: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      api.get(`/disciplinas/${id}`)
        .then(response => setDisciplina(response.data))
        .catch(error => {
            console.error('Erro ao buscar disciplina:', error);
            toast.error("Não foi possível carregar os dados da disciplina.");
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisciplina({ ...disciplina, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!disciplina.nome) newErrors.nome = 'Nome é obrigatório.';
    if (!disciplina.codigo) newErrors.codigo = 'Código é obrigatório.';
    if (disciplina.codigo && disciplina.codigo.length > 10) newErrors.codigo = 'Código deve ter no máximo 10 caracteres.';
    if (!disciplina.periodo) newErrors.periodo = 'Período é obrigatório.';
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
        await api.put(`/disciplinas/${id}`, disciplina);
        toast.success("Disciplina atualizada com sucesso!");
      } else {
        await api.post('/disciplinas', disciplina);
        toast.success("Disciplina criada com sucesso!");
      }
      navigate('/disciplinas');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro inesperado.';
      console.error('Erro ao salvar disciplina:', errorMessage, error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">{isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="nome" className="form-label">Nome da Disciplina *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={disciplina.nome} onChange={handleChange} required />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="codigo" className="form-label">Código *</label>
                <input type="text" className={`form-control ${errors.codigo ? 'is-invalid' : ''}`} id="codigo" name="codigo" value={disciplina.codigo} onChange={handleChange} maxLength="10" required />
                {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="periodo" className="form-label">Período *</label>
                <input type="text" className={`form-control ${errors.periodo ? 'is-invalid' : ''}`} id="periodo" name="periodo" value={disciplina.periodo} onChange={handleChange} placeholder="Ex: 2025.1" required />
                {errors.periodo && <div className="invalid-feedback">{errors.periodo}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="carga_horaria" className="form-label">Carga Horária (horas)</label>
                <input type="number" className="form-control" id="carga_horaria" name="carga_horaria" value={disciplina.carga_horaria || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="modalidade" className="form-label">Modalidade</label>
                <input type="text" className="form-control" id="modalidade" name="modalidade" value={disciplina.modalidade || ''} onChange={handleChange} placeholder="Ex: Presencial, EAD" />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 text-end mt-4 p-0">
                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/disciplinas')}>
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

export default DisciplinaForm;