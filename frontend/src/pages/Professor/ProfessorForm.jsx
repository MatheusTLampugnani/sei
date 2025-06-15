import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const validarCPF = (cpf) => {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const digitos = cpf.split('').map(el => +el);
  const resto = (offset) => digitos.slice(0, 9 + offset).reduce((sum, el, index) => sum + el * (10 + offset - index), 0) % 11;
  const d1 = resto(0) < 2 ? 0 : 11 - resto(0);
  if (d1 !== digitos[9]) return false;
  const d2 = resto(1) < 2 ? 0 : 11 - resto(1);
  if (d2 !== digitos[10]) return false;
  return true;
}

const ProfessorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [professor, setProfessor] = useState({
    nome: '',
    email: '',
    cpf: '',
    titulacao: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      api.get(`/professores/${id}`)
        .then(response => setProfessor(response.data))
        .catch(error => {
            console.error('Erro ao buscar professor:', error);
            toast.error("Não foi possível carregar os dados do professor.");
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfessor({ ...professor, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!professor.nome) newErrors.nome = 'Nome é obrigatório.';
    if (!professor.titulacao) newErrors.titulacao = 'Titulação é obrigatória.';
    if (!professor.cpf) {
        newErrors.cpf = 'CPF é obrigatório.';
    } else if (!validarCPF(professor.cpf)) {
        newErrors.cpf = 'CPF inválido. Verifique os dígitos.';
    }
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
    const dataToSend = { ...professor, cpf: professor.cpf.replace(/[^\d]/g, '') };

    try {
      if (id) {
        await api.put(`/professores/${id}`, dataToSend);
        toast.success('Professor atualizado com sucesso!');
      } else {
        await api.post('/professores', dataToSend);
        toast.success('Professor criado com sucesso!');
      }
      navigate('/professores');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro inesperado.';
      console.error('Erro ao salvar professor:', errorMessage, error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">{isEditing ? 'Editar Professor' : 'Novo Professor'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome Completo *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={professor.nome} onChange={handleChange} required />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="cpf" className="form-label">CPF *</label>
                <input type="text" className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} id="cpf" name="cpf" value={professor.cpf} onChange={handleChange} placeholder="Digite somente os números" required />
                {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="titulacao" className="form-label">Titulação *</label>
                <input type="text" className={`form-control ${errors.titulacao ? 'is-invalid' : ''}`} id="titulacao" name="titulacao" value={professor.titulacao} onChange={handleChange} placeholder="Ex: Mestre, Doutor" required />
                {errors.titulacao && <div className="invalid-feedback">{errors.titulacao}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" value={professor.email || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 text-end mt-4 p-0">
              <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/professores')}>
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

export default ProfessorForm;