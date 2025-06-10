const express = require('express');
const cors = require('cors');
const config = require('./config');
const verifyToken = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const localRoutes = require('./routes/localRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Public route
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/professores', verifyToken, professorRoutes);
app.use('/api/disciplinas', verifyToken, disciplinaRoutes);
app.use('/api/locais', verifyToken, localRoutes);
app.use('/api/turmas', verifyToken, turmaRoutes);
app.use('/api/alunos', verifyToken, alunoRoutes);


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