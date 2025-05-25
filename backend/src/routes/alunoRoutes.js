const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

// GET /api/alunos - Lista todos os alunos (com filtro opcional de status)
router.get('/', AlunoController.listarAlunos);

// GET /api/alunos/:id - Obtém um aluno específico
router.get('/:id', AlunoController.obterAluno);

// POST /api/alunos - Cria um novo aluno
router.post('/', AlunoController.criarAluno);

// PUT /api/alunos/:id - Atualiza um aluno existente
router.put('/:id', AlunoController.atualizarAluno);

// PATCH /api/alunos/:id/desativar - Desativa um aluno
router.patch('/:id/desativar', AlunoController.desativarAluno);

// PATCH /api/alunos/:id/reativar - Reativa um aluno
router.patch('/:id/reativar', AlunoController.reativarAluno);

// GET /api/alunos/:idAluno/turmas - Lista turmas de um aluno
router.get('/:idAluno/turmas', AlunoController.listarTurmasAluno);

// GET /api/alunos/count/total - Conta o total de alunos
router.get('/count/total', AlunoController.contarAlunos);

module.exports = router;