const express = require('express');
const cors = require('cors');
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const localRoutes = require('./routes/localRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/professores', professorRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/locais', localRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP',
    timestamp: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'SEI - Sistema Educacional Integrado',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});