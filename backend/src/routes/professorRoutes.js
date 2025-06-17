const express = require('express');
const router = express.Router();
const ProfessorController = require('../controllers/professorController');

router.get('/', ProfessorController.listarProfessores);
router.get('/:id', ProfessorController.obterProfessor);
router.post('/', ProfessorController.criarProfessor);
router.put('/:id', ProfessorController.atualizarProfessor);
router.patch('/:id/desativar', ProfessorController.desativarProfessor);
router.patch('/:id/reativar', ProfessorController.reativarProfessor);
router.get('/count/total', ProfessorController.contarProfessores);

module.exports = router;