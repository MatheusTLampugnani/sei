const express = require('express');
const router = express.Router();
const ProfessorController = require('../controllers/professorController');

// GET /api/professores - Lista todos os professores (com filtro opcional de status)
router.get('/', ProfessorController.listarProfessores);

// GET /api/professores/:id - Obtém um professor específico
router.get('/:id', ProfessorController.obterProfessor);

// POST /api/professores - Cria um novo professor
router.post('/', ProfessorController.criarProfessor);

// PUT /api/professores/:id - Atualiza um professor existente
router.put('/:id', ProfessorController.atualizarProfessor);

// PATCH /api/professores/:id/desativar - Desativa um professor
router.patch('/:id/desativar', ProfessorController.desativarProfessor);

// PATCH /api/professores/:id/reativar - Reativa um professor
router.patch('/:id/reativar', ProfessorController.reativarProfessor);

// GET /api/professores/count/total - Conta o total de professores
router.get('/count/total', ProfessorController.contarProfessores);

module.exports = router;