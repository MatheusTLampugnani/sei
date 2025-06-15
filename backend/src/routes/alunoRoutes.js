const express = require('express');
const router = express.Router();
const AlunoController = require('../controllers/alunoController');

router.get('/', AlunoController.listarAlunos);
router.get('/:id', AlunoController.obterAluno);
router.post('/', AlunoController.criarAluno);
router.put('/:id', AlunoController.atualizarAluno);
router.patch('/:id/desativar', AlunoController.desativarAluno);
router.patch('/:id/reativar', AlunoController.reativarAluno);
router.get('/:idAluno/turmas', AlunoController.listarTurmasAluno);
router.get('/count/total', AlunoController.contarAlunos);

module.exports = router;