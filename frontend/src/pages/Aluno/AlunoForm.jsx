import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const validarCPF = (cpf) => {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const digitos = cpf.split('').map(el => +el);
  
  const resto = (offset) => digitos
    .slice(0, 9 + offset)
    .reduce((sum, el, index) => sum + el * (10 + offset - index), 0) % 11;

  const digitoVerificador1 = resto(0) < 2 ? 0 : 11 - resto(0);
  if (digitoVerificador1 !== digitos[9]) return false;
  
  const digitoVerificador2 = resto(1) < 2 ? 0 : 11 - resto(1);
  if (digitoVerificador2 !== digitos[10]) return false;

  return true;
}

const AlunoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [aluno, setAluno] = useState({
    nome: '',
    data_nascimento: '',
    cpf: '',
    email: '',
    matricula: '',
    curso: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      api.get(`/alunos/${id}`)
        .then(response => {
            const data = response.data;
            if (data.data_nascimento) {
                data.data_nascimento = data.data_nascimento.split('T')[0];
            }
            setAluno(data);
        })
        .catch(error => {
            console.error('Erro ao buscar aluno:', error)
            toast.error("Não foi possível carregar os dados do aluno.")
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!aluno.nome) newErrors.nome = 'Nome é obrigatório.';
    if (!aluno.matricula) newErrors.matricula = 'Matrícula é obrigatória.';
    if (!aluno.data_nascimento) newErrors.data_nascimento = 'Data de Nascimento é obrigatória.';
    if (!aluno.curso) newErrors.curso = 'Curso é obrigatório.';
    if (!aluno.cpf) {
        newErrors.cpf = 'CPF é obrigatório.';
    } else if (!validarCPF(aluno.cpf)) {
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
    const dataToSend = { ...aluno, cpf: aluno.cpf.replace(/[^\d]/g, '') };

    try {
      if (id) {
        await api.put(`/alunos/${id}`, dataToSend);
        toast.success('Aluno atualizado com sucesso!');
      } else {
        await api.post('/alunos', dataToSend);
        toast.success('Aluno criado com sucesso!');
      }
      navigate('/alunos');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro inesperado.';
      console.error('Erro ao salvar aluno:', errorMessage, error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">{isEditing ? 'Editar Aluno' : 'Novo Aluno'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nome" className="form-label">Nome Completo *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={aluno.nome} onChange={handleChange} required />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="cpf" className="form-label">CPF *</label>
                <input type="text" className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} id="cpf" name="cpf" value={aluno.cpf} onChange={handleChange} placeholder="Digite somente os números" required />
                {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="matricula" className="form-label">Matrícula *</label>
                <input type="text" className={`form-control ${errors.matricula ? 'is-invalid' : ''}`} id="matricula" name="matricula" value={aluno.matricula} onChange={handleChange} required />
                {errors.matricula && <div className="invalid-feedback">{errors.matricula}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="data_nascimento" className="form-label">Data de Nascimento *</label>
                <input type="date" className={`form-control ${errors.data_nascimento ? 'is-invalid' : ''}`} id="data_nascimento" name="data_nascimento" value={aluno.data_nascimento} onChange={handleChange} required />
                {errors.data_nascimento && <div className="invalid-feedback">{errors.data_nascimento}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" value={aluno.email || ''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="curso" className="form-label">Curso *</label>
                <select className={`form-select ${errors.curso ? 'is-invalid' : ''}`} id="curso" name="curso" value={aluno.curso} onChange={handleChange} required>
                    <option value="">Selecione um curso</option>
                    <option value="Engenharia de Software">Engenharia de Software</option>
                    <option value="Medicina">Medicina</option>
                    <option value="Direito">Direito</option>
                    <option value="Administração">Administração</option>
                    <option value="Agronomia">Agronomia</option>
                </select>
                {errors.curso && <div className="invalid-feedback">{errors.curso}</div>}
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 text-end mt-4 p-0">
                <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/alunos')}>
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

export default AlunoForm;