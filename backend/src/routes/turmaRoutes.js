const express = require('express');
const router = express.Router();
const TurmaController = require('../controllers/turmaController');

// GET /api/turmas - Lista todas as turmas (com filtro opcional de status)
router.get('/', TurmaController.listarTurmas);

// GET /api/turmas/:id - Obtém uma turma específica
router.get('/:id', TurmaController.obterTurma);

// POST /api/turmas - Cria uma nova turma
router.post('/', TurmaController.criarTurma);

// PUT /api/turmas/:id - Atualiza uma turma existente
router.put('/:id', TurmaController.atualizarTurma);

// PATCH /api/turmas/:id/desativar - Desativa uma turma
router.patch('/:id/desativar', TurmaController.desativarTurma);

// PATCH /api/turmas/:id/reativar - Reativa uma turma
router.patch('/:id/reativar', TurmaController.reativarTurma);

// POST /api/turmas/:idTurma/alunos/:idAluno - Adiciona aluno à turma
router.post('/:idTurma/alunos/:idAluno', TurmaController.adicionarAluno);

// DELETE /api/turmas/:idTurma/alunos/:idAluno - Remove aluno da turma
router.delete('/:idTurma/alunos/:idAluno', TurmaController.removerAluno);

// GET /api/turmas/:idTurma/alunos - Lista alunos de uma turma
router.get('/:idTurma/alunos', TurmaController.listarAlunosTurma);

// GET /api/turmas/count/total - Conta o total de turmas
router.get('/count/total', TurmaController.contarTurmas);

module.exports = router;