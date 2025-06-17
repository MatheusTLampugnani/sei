const express = require('express');
const router = express.Router();
const LocalController = require('../controllers/localController');

router.get('/', LocalController.listarLocais);
router.get('/:id', LocalController.obterLocal);
router.post('/', LocalController.criarLocal);
router.put('/:id', LocalController.atualizarLocal);
router.patch('/:id/desativar', LocalController.desativarLocal);
router.patch('/:id/reativar', LocalController.reativarLocal);
router.get('/count/total', LocalController.contarLocais);

module.exports = router;