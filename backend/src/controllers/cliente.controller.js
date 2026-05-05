const db = require('../db');

exports.create = async (req, res) => {
    try {
        const { nome, telefone, area } = req.body;

        const checkQuery = 'SELECT id FROM clientes WHERE telefone = $1';
        const checkResult = await db.query(checkQuery, [telefone]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Este número de telefone já está cadastrado na cartela.' });
        }

        const insertQuery = `
            INSERT INTO clientes (nome, telefone, area)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const values = [nome, telefone, area];
        const result = await db.query(insertQuery, values);

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
};

exports.list = async (req, res) => {
    try {
        const query = 'SELECT * FROM clientes ORDER BY id DESC';
        const result = await db.query(query);
        
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar clientes' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, telefone, area } = req.body;

        const checkQuery = 'SELECT id FROM clientes WHERE telefone = $1 AND id != $2';
        const checkResult = await db.query(checkQuery, [telefone, id]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Este número de telefone já está cadastrado em outro cliente.' });
        }

        const updateQuery = `
            UPDATE clientes
            SET nome = $1, telefone = $2, area = $3
            WHERE id = $4
            RETURNING *
        `;

        const result = await db.query(updateQuery, [nome, telefone, area, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQuery = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
        const result = await db.query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        return res.json({ message: 'Cliente removido com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
};
