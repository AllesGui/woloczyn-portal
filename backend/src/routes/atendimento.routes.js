const express = require('express');
const router = express.Router();
const atendimentoController = require('../controllers/atendimento.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const apiKeyMiddleware = require('../middlewares/api-key.middleware');

// Public route for n8n Webhook protected by API Key
router.post('/', apiKeyMiddleware, atendimentoController.create);

// Private routes protected by JWT
router.use(authMiddleware);

router.get('/', atendimentoController.list);
router.put('/:id/finalizar', atendimentoController.finalizar);

module.exports = router;
