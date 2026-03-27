const db = require('../db');

exports.getEvents = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM agenda_events ORDER BY date ASC, time ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar eventos da agenda' });
    }
};

exports.createEvent = async (req, res) => {
    const { title, client, date, time, duration, urgency, description, responsible_lawyer } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO agenda_events (title, client, date, time, duration, urgency, description, responsible_lawyer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, client, date, time, duration, urgency, description, responsible_lawyer]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar evento na agenda' });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, client, date, time, duration, urgency, description, responsible_lawyer } = req.body;
    try {
        const result = await db.query(
            'UPDATE agenda_events SET title = $1, client = $2, date = $3, time = $4, duration = $5, urgency = $6, description = $7, responsible_lawyer = $8 WHERE id = $9 RETURNING *',
            [title, client, date, time, duration, urgency, description, responsible_lawyer, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar evento na agenda' });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM agenda_events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.json({ message: 'Evento excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir evento na agenda' });
    }
};
