import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TurmaAlunos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turma, setTurma] = useState(null);
  const [alunosMatriculados, setAlunosMatriculados] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alunoSelecionado, setAlunoSelecionado] = useState('');

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [turmaRes, matriculadosRes, todosAlunosRes] = await Promise.all([
        api.get(`/turmas/${id}`),
        api.get(`/turmas/${id}/alunos`),
        api.get('/alunos?ativo=true')
      ]);

      setTurma(turmaRes.data);
      setAlunosMatriculados(matriculadosRes.data);

      const matriculadosIds = new Set(matriculadosRes.data.map(a => a.idaluno));
      setAlunosDisponiveis(todosAlunosRes.data.filter(a => !matriculadosIds.has(a.idaluno)));

    } catch (error) {
      console.error("Erro ao buscar dados da turma e alunos:", error);
      alert('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [id]);

  const handleAddAluno = async () => {
    if (!alunoSelecionado) {
      alert('Por favor, selecione um aluno para adicionar.');
      return;
    }
    try {
      await api.post(`/turmas/${id}/alunos/${alunoSelecionado}`);
      alert('Aluno adicionado com sucesso!');
      setAlunoSelecionado('');
      fetchDados(); // Re-fetch all data
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      alert(error.response?.data?.error || 'Ocorreu um erro ao adicionar o aluno.');
    }
  };

  const handleRemoveAluno = async (idAluno) => {
    if (window.confirm('Tem certeza que deseja remover este aluno da turma?')) {
      try {
        await api.delete(`/turmas/${id}/alunos/${idAluno}`);
        alert('Aluno removido com sucesso!');
        fetchDados(); // Re-fetch all data
      } catch (error) {
        console.error('Erro ao remover aluno:', error);
        alert(error.response?.data?.error || 'Ocorreu um erro ao remover o aluno.');
      }
    }
  };

  if (loading) {
    return <div className="container mt-5"><p>Carregando...</p></div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Gerenciar Alunos da Turma</h1>
      {turma && (
        <div className="card bg-light mb-4">
            <div className="card-body">
                <h5 className="card-title">{turma.nome}</h5>
                <p className="card-text">
                    <strong>Disciplina:</strong> {turma.disciplina_nome} <br />
                    <strong>Professor:</strong> {turma.professor_nome} <br />
                    <strong>Horário:</strong> {turma.dia_semana}, {turma.horario_inicio} - {turma.horario_termino}
                </p>
            </div>
        </div>
      )}

      <div className="row">
        {/* Lado esquerdo: Adicionar Alunos */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3>Adicionar Aluno à Turma</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="aluno-select" className="form-label">Selecione um Aluno Disponível:</label>
                <select
                  id="aluno-select"
                  className="form-select"
                  value={alunoSelecionado}
                  onChange={(e) => setAlunoSelecionado(e.target.value)}
                >
                  <option value="">-- Escolha um aluno --</option>
                  {alunosDisponiveis.map(aluno => (
                    <option key={aluno.idaluno} value={aluno.idaluno}>
                      {aluno.nome} (Matrícula: {aluno.matricula})
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleAddAluno}>Adicionar Aluno</button>
            </div>
             {alunosDisponiveis.length === 0 && <div className="card-footer text-muted">Todos os alunos já estão nesta turma.</div>}
          </div>
        </div>

        {/* Lado direito: Alunos Matriculados */}
        <div className="col-md-6">
          <h3>Alunos Matriculados ({alunosMatriculados.length})</h3>
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {alunosMatriculados.length > 0 ? alunosMatriculados.map(aluno => (
                <tr key={aluno.idaluno}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.matricula}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveAluno(aluno.idaluno)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center">Nenhum aluno matriculado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => navigate('/turmas')}>
                Voltar para a Lista de Turmas
            </button>
       </div>
    </div>
  );
};

export default TurmaAlunos;