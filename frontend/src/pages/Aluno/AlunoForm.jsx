import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const AlunoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [aluno, setAluno] = useState({
    nome: '',
    data_nascimento: '',
    cpf: '',
    email: '',
    matricula: '',
    curso: '', // Adicione outros campos se necessário
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      api.get(`/alunos/${id}`)
        .then(response => {
            const data = response.data;
            // Formata a data para YYYY-MM-DD para o input type="date"
            if (data.data_nascimento) {
                data.data_nascimento = data.data_nascimento.split('T')[0];
            }
            setAluno(data);
        })
        .catch(error => console.error('Erro ao buscar aluno:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!aluno.nome) newErrors.nome = 'Nome é obrigatório'; // [cite: 68]
    if (!aluno.cpf) newErrors.cpf = 'CPF é obrigatório'; // [cite: 68]
    // Adicionar validação de CPF (importar do backend ou reimplementar)
    if (aluno.cpf && !/^\d{11}$/.test(aluno.cpf.replace(/[^\d]/g, ''))) newErrors.cpf = 'CPF deve ter 11 dígitos';
    if (!aluno.matricula) newErrors.matricula = 'Matrícula é obrigatória';
    if (!aluno.data_nascimento) newErrors.data_nascimento = 'Data de Nascimento é obrigatória';
    if (!aluno.curso) newErrors.curso = 'Curso é obrigatório'; // [cite: 37]
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Limpa o CPF para enviar apenas números
    const dataToSend = { ...aluno, cpf: aluno.cpf.replace(/[^\d]/g, '') };

    try {
      if (id) {
        await api.put(`/alunos/${id}`, dataToSend);
      } else {
        await api.post('/alunos', dataToSend);
      }
      navigate('/alunos');
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      if (error.response && error.response.data.error) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert('Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Editar Aluno' : 'Novo Aluno'}</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nome" className="form-label">Nome *</label>
              <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={aluno.nome} onChange={handleChange} />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="cpf" className="form-label">CPF * (somente números)</label>
              <input type="text" className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} id="cpf" name="cpf" value={aluno.cpf} onChange={handleChange} maxLength="14" />
              {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
            </div>
             <div className="col-md-6">
              <label htmlFor="matricula" className="form-label">Matrícula *</label>
              <input type="text" className={`form-control ${errors.matricula ? 'is-invalid' : ''}`} id="matricula" name="matricula" value={aluno.matricula} onChange={handleChange} />
              {errors.matricula && <div className="invalid-feedback">{errors.matricula}</div>}
            </div>
             <div className="col-md-6">
              <label htmlFor="data_nascimento" className="form-label">Data de Nascimento *</label>
              <input type="date" className={`form-control ${errors.data_nascimento ? 'is-invalid' : ''}`} id="data_nascimento" name="data_nascimento" value={aluno.data_nascimento} onChange={handleChange} />
              {errors.data_nascimento && <div className="invalid-feedback">{errors.data_nascimento}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={aluno.email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label htmlFor="curso" className="form-label">Curso *</label>
              <input type="text" className={`form-control ${errors.curso ? 'is-invalid' : ''}`} id="curso" name="curso" value={aluno.curso} onChange={handleChange} />
              {/* Idealmente, este seria um <select> populado via API */}
              {errors.curso && <div className="invalid-feedback">{errors.curso}</div>}
            </div>
        </div>
        <div className="mt-4">
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/alunos')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AlunoForm;