const express = require('express');
const router = express.Router();
const LocalController = require('../controllers/localController');

// GET /api/locais - Lista todos os locais (com filtro opcional de status)
router.get('/', LocalController.listarLocais);

// GET /api/locais/:id - Obtém um local específico
router.get('/:id', LocalController.obterLocal);

// POST /api/locais - Cria um novo local
router.post('/', LocalController.criarLocal);

// PUT /api/locais/:id - Atualiza um local existente
router.put('/:id', LocalController.atualizarLocal);

// PATCH /api/locais/:id/desativar - Desativa um local
router.patch('/:id/desativar', LocalController.desativarLocal);

// PATCH /api/locais/:id/reativar - Reativa um local
router.patch('/:id/reativar', LocalController.reativarLocal);

// GET /api/locais/count/total - Conta o total de locais
router.get('/count/total', LocalController.contarLocais);

module.exports = router;