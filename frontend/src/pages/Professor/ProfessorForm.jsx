import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ProfessorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [professor, setProfessor] = useState({
    nome: '',
    email: '',
    cpf: '',
    titulacao: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchProfessor();
    }
  }, [id]);

  const fetchProfessor = async () => {
    try {
      const response = await api.get(`/professores/${id}`);
      setProfessor(response.data);
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfessor({ ...professor, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!professor.nome) newErrors.nome = 'Nome é obrigatório';
    if (!professor.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (professor.cpf && professor.cpf.length !== 11) newErrors.cpf = 'CPF deve ter 11 dígitos';
    if (!professor.titulacao) newErrors.titulacao = 'Titulação é obrigatória';
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
        await api.put(`/professores/${id}`, professor);
      } else {
        await api.post('/professores', professor);
      }
      navigate('/professores');
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="container">
      <h1>{id ? 'Editar Professor' : 'Novo Professor'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            id="nome"
            name="nome"
            value={professor.nome}
            onChange={handleChange}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="cpf" className="form-label">
            CPF
          </label>
          <input
            type="text"
            className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
            id="cpf"
            name="cpf"
            value={professor.cpf}
            onChange={handleChange}
            maxLength="11"
          />
          {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="titulacao" className="form-label">
            Titulação
          </label>
          <input
            type="text"
            className={`form-control ${errors.titulacao ? 'is-invalid' : ''}`}
            id="titulacao"
            name="titulacao"
            value={professor.titulacao}
            onChange={handleChange}
          />
          {errors.titulacao && <div className="invalid-feedback">{errors.titulacao}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={professor.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/professores')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ProfessorForm;