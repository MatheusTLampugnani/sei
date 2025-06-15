const express = require('express');
const cors = require('cors');
const config = require('./config');
const setupDatabase = require('./database/dbSetup');
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const localRoutes = require('./routes/localRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/professores', professorRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/locais', localRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);

const startServer = async () => {
  await setupDatabase();

  app.listen(config.port, () => {
    console.log(`Servidor rodando na porta ${config.port}`);
  });
};

startServer();