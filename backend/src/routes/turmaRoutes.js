const express = require('express');
const router = express.Router();
const TurmaController = require('../controllers/turmaController');

router.get('/', TurmaController.listarTurmas);
router.get('/:id', TurmaController.obterTurma);
router.post('/', TurmaController.criarTurma);
router.put('/:id', TurmaController.atualizarTurma);
router.patch('/:id/desativar', TurmaController.desativarTurma);
router.patch('/:id/reativar', TurmaController.reativarTurma);
router.post('/:idTurma/alunos/:idAluno', TurmaController.adicionarAluno);
router.delete('/:idTurma/alunos/:idAluno', TurmaController.removerAluno);
router.get('/:idTurma/alunos', TurmaController.listarAlunosTurma);
router.get('/count/total', TurmaController.contarTurmas);

module.exports = router;