const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agenda.controller');

router.get('/', agendaController.getEvents);
router.post('/', agendaController.createEvent);
router.put('/:id', agendaController.updateEvent);
router.delete('/:id', agendaController.deleteEvent);

module.exports = router;
