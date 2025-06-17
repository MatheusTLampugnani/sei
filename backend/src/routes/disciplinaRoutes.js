const express = require('express');
const router = express.Router();
const DisciplinaController = require('../controllers/disciplinaController');

router.get('/', DisciplinaController.listarDisciplinas);
router.get('/:id', DisciplinaController.obterDisciplina);
router.post('/', DisciplinaController.criarDisciplina);
router.put('/:id', DisciplinaController.atualizarDisciplina);
router.patch('/:id/desativar', DisciplinaController.desativarDisciplina);
router.patch('/:id/reativar', DisciplinaController.reativarDisciplina);
router.get('/count/total', DisciplinaController.contarDisciplinas);

module.exports = router;