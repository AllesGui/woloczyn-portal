const db = require('../db');
const bcrypt = require('bcrypt');

const validateStrongPassword = (password) => {
    const minLength = /.{6,}/;
    const hasLetter = /[a-zA-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecial = /[^a-zA-Z0-9]/;
    return minLength.test(password) && hasLetter.test(password) && hasNumber.test(password) && hasSpecial.test(password);
};

exports.list = async (req, res) => {
    try {
        const query = 'SELECT id, name, email, created_at, locked_until FROM users ORDER BY created_at DESC';
        const result = await db.query(query);
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, email, password, must_change_password } = req.body;

        if (!validateStrongPassword(password)) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres, contendo letras, números e caracteres especiais.' });
        }

        const checkQuery = 'SELECT id FROM users WHERE email = $1';
        const checkResult = await db.query(checkQuery, [email]);
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO users (name, email, password_hash, must_change_password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, created_at, locked_until
        `;

        const values = [name, email, password_hash, must_change_password || false];
        const result = await db.query(insertQuery, values);

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, unlock } = req.body;

        let query = 'UPDATE users SET name = $1, email = $2';
        let values = [name, email];
        let index = 3;

        if (password) {
            if (!validateStrongPassword(password)) {
                return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres, contendo letras, números e caracteres especiais.' });
            }
            const password_hash = await bcrypt.hash(password, 10);
            query += `, password_hash = $${index++}`;
            values.push(password_hash);
        }

        if (unlock) {
            query += `, locked_until = NULL, failed_login_attempts = 0`;
        }

        query += ` WHERE id = $${index} RETURNING id, name, email, created_at, locked_until`;
        values.push(id);

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await db.query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Usuário removido com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
};
