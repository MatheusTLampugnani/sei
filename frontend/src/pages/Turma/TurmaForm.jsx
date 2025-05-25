import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const TurmaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [turma, setTurma] = useState({
    nome: '',
    dia_semana: '',
    horario_inicio: '',
    horario_termino: '',
    idLocal: '',
    idDisciplina: '',
    idProfessor: '',
    // Adicionar outros campos se necessário (ano_semestre, turno)
  });
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch data for dropdowns
    api.get('/professores?ativo=true').then(res => setProfessores(res.data));
    api.get('/disciplinas?ativo=true').then(res => setDisciplinas(res.data));
    api.get('/locais?ativo=true').then(res => setLocais(res.data));

    if (id) {
      api.get(`/turmas/${id}`)
        .then(response => setTurma(response.data))
        .catch(error => console.error('Erro ao buscar turma:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurma({ ...turma, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!turma.nome) newErrors.nome = 'Nome é obrigatório'; // [cite: 68]
    if (!turma.dia_semana) newErrors.dia_semana = 'Dia da Semana é obrigatório'; // [cite: 68]
    if (!turma.horario_inicio) newErrors.horario_inicio = 'Horário de Início é obrigatório'; // [cite: 68]
    if (!turma.horario_termino) newErrors.horario_termino = 'Horário de Término é obrigatório'; // [cite: 68]
    if (!turma.idLocal) newErrors.idLocal = 'Local é obrigatório';
    if (!turma.idDisciplina) newErrors.idDisciplina = 'Disciplina é obrigatória';
    if (!turma.idProfessor) newErrors.idProfessor = 'Professor é obrigatório';
    // Adicionar validação de conflito de horário/local se necessário
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
        await api.put(`/turmas/${id}`, turma);
      } else {
        await api.post('/turmas', turma);
      }
      navigate('/turmas');
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
       alert(error.response?.data?.error || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Editar Turma' : 'Nova Turma'}</h1>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
             <div className="col-md-12">
                <label htmlFor="nome" className="form-label">Nome da Turma *</label>
                <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} id="nome" name="nome" value={turma.nome} onChange={handleChange} />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="idDisciplina" className="form-label">Disciplina *</label>
                <select className={`form-select ${errors.idDisciplina ? 'is-invalid' : ''}`} id="idDisciplina" name="idDisciplina" value={turma.idDisciplina} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    {disciplinas.map(d => <option key={d.iddisciplina} value={d.iddisciplina}>{d.nome} ({d.codigo})</option>)}
                </select>
                 {errors.idDisciplina && <div className="invalid-feedback">{errors.idDisciplina}</div>}
            </div>
             <div className="col-md-6">
                <label htmlFor="idProfessor" className="form-label">Professor *</label>
                <select className={`form-select ${errors.idProfessor ? 'is-invalid' : ''}`} id="idProfessor" name="idProfessor" value={turma.idProfessor} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    {professores.map(p => <option key={p.idprofessor} value={p.idprofessor}>{p.nome}</option>)}
                </select>
                {errors.idProfessor && <div className="invalid-feedback">{errors.idProfessor}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="idLocal" className="form-label">Local (Sala) *</label>
                <select className={`form-select ${errors.idLocal ? 'is-invalid' : ''}`} id="idLocal" name="idLocal" value={turma.idLocal} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    {locais.map(l => <option key={l.idlocal} value={l.idlocal}>{l.nome} ({l.local})</option>)}
                </select>
                {errors.idLocal && <div className="invalid-feedback">{errors.idLocal}</div>}
            </div>
             <div className="col-md-6">
                <label htmlFor="dia_semana" className="form-label">Dia da Semana *</label>
                <select className={`form-select ${errors.dia_semana ? 'is-invalid' : ''}`} id="dia_semana" name="dia_semana" value={turma.dia_semana} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="Segunda">Segunda-feira</option>
                    <option value="Terça">Terça-feira</option>
                    <option value="Quarta">Quarta-feira</option>
                    <option value="Quinta">Quinta-feira</option>
                    <option value="Sexta">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                </select>
                 {errors.dia_semana && <div className="invalid-feedback">{errors.dia_semana}</div>}
            </div>
            <div className="col-md-6">
                <label htmlFor="horario_inicio" className="form-label">Horário Início *</label>
                <input type="time" className={`form-control ${errors.horario_inicio ? 'is-invalid' : ''}`} id="horario_inicio" name="horario_inicio" value={turma.horario_inicio} onChange={handleChange} />
                 {errors.horario_inicio && <div className="invalid-feedback">{errors.horario_inicio}</div>}
            </div>
             <div className="col-md-6">
                <label htmlFor="horario_termino" className="form-label">Horário Término *</label>
                <input type="time" className={`form-control ${errors.horario_termino ? 'is-invalid' : ''}`} id="horario_termino" name="horario_termino" value={turma.horario_termino} onChange={handleChange} />
                {errors.horario_termino && <div className="invalid-feedback">{errors.horario_termino}</div>}
            </div>
             {/* Adicionar campos ano_semestre e turno se necessário */}
        </div>
        <div className="mt-4">
            <button type="submit" className="btn btn-primary">Salvar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/turmas')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default TurmaForm;