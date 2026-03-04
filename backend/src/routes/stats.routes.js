const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.get('/', statsController.getStats);

module.exports = router;
