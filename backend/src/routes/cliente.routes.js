const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/', clienteController.create);
router.get('/', clienteController.list);
router.put('/:id', clienteController.update);

module.exports = router;
