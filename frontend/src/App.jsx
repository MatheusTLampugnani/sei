import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfessorList from './pages/Professor/ProfessorList';
import ProfessorForm from './pages/Professor/ProfessorForm';
import ReativarProfessor from './pages/Professor/ReativarProfessor';
import DisciplinaList from './pages/Disciplina/DisciplinaList';
import DisciplinaForm from './pages/Disciplina/DisciplinaForm';
import ReativarDisciplina from './pages/Disciplina/ReativarDisciplina';
import LocalList from './pages/Local/LocalList';
import LocalForm from './pages/Local/LocalForm';
import ReativarLocal from './pages/Local/ReativarLocal';
import TurmaList from './pages/Turma/TurmaList';
import TurmaForm from './pages/Turma/TurmaForm';
import ReativarTurma from './pages/Turma/ReativarTurma';
import TurmaAlunos from './pages/Turma/TurmaAlunos';
import AlunoList from './pages/Aluno/AlunoList';
import AlunoForm from './pages/Aluno/AlunoForm';
import ReativarAluno from './pages/Aluno/ReativarAluno';

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/professores" element={<ProfessorList />} />
          <Route path="/professores/novo" element={<ProfessorForm />} />
          <Route path="/professores/editar/:id" element={<ProfessorForm />} />
          <Route path="/professores/reativar" element={<ReativarProfessor />} />
          <Route path="/disciplinas" element={<DisciplinaList />} />
          <Route path="/disciplinas/novo" element={<DisciplinaForm />} />
          <Route path="/disciplinas/editar/:id" element={<DisciplinaForm />} />
          <Route path="/disciplinas/reativar" element={<ReativarDisciplina />} />
          <Route path="/locais" element={<LocalList />} />
          <Route path="/locais/novo" element={<LocalForm />} />
          <Route path="/locais/editar/:id" element={<LocalForm />} />
          <Route path="/locais/reativar" element={<ReativarLocal />} />
          <Route path="/turmas" element={<TurmaList />} />
          <Route path="/turmas/novo" element={<TurmaForm />} />
          <Route path="/turmas/editar/:id" element={<TurmaForm />} />
          <Route path="/turmas/reativar" element={<ReativarTurma />} />
          <Route path="/turmas/:id/alunos" element={<TurmaAlunos />} />
          <Route path="/alunos" element={<AlunoList />} />
          <Route path="/alunos/novo" element={<AlunoForm />} />
          <Route path="/alunos/editar/:id" element={<AlunoForm />} />
          <Route path="/alunos/reativar" element={<ReativarAluno />} />
        </Routes>
      </div>
    </>
  );
}

export default App;