const express = require('express');
const router = express.Router();
const DisciplinaController = require('../controllers/disciplinaController');

// GET /api/disciplinas - Lista todas as disciplinas (com filtro opcional de status)
router.get('/', DisciplinaController.listarDisciplinas);

// GET /api/disciplinas/:id - Obtém uma disciplina específica
router.get('/:id', DisciplinaController.obterDisciplina);

// POST /api/disciplinas - Cria uma nova disciplina
router.post('/', DisciplinaController.criarDisciplina);

// PUT /api/disciplinas/:id - Atualiza uma disciplina existente
router.put('/:id', DisciplinaController.atualizarDisciplina);

// PATCH /api/disciplinas/:id/desativar - Desativa uma disciplina
router.patch('/:id/desativar', DisciplinaController.desativarDisciplina);

// PATCH /api/disciplinas/:id/reativar - Reativa uma disciplina
router.patch('/:id/reativar', DisciplinaController.reativarDisciplina);

// GET /api/disciplinas/count/total - Conta o total de disciplinas
router.get('/count/total', DisciplinaController.contarDisciplinas);

module.exports = router;