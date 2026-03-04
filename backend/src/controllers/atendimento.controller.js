const db = require('../db');

exports.create = async (req, res) => {
    try {
        const { nome, telefone, area_juridica, prioridade, resumo, status = 'pendente' } = req.body;

        const checkQuery = await db.query(
            "SELECT id FROM atendimentos WHERE telefone = $1 AND status = 'pendente'",
            [telefone]
        );

        if (checkQuery.rows.length > 0) {
            return res.status(200).json({ message: 'Telefone já possui atendimento pendente. Ignorando.' });
        }

        const insertQuery = `
            INSERT INTO atendimentos (nome, telefone, area_juridica, prioridade, resumo, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [nome, telefone, area_juridica, prioridade, resumo, status];
        const result = await db.query(insertQuery, values);

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar atendimento' });
    }
};

exports.list = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM atendimentos';
        let values = [];

        if (status) {
            query += ' WHERE status = $1';
            values.push(status);
        }

        const result = await db.query(query, values);
        let atendimentos = result.rows;

        if (status === 'pendente') {
            const priorityWeight = { 'Alta': 3, 'Media': 2, 'Média': 2, 'Baixa': 1 };
            atendimentos.sort((a, b) => {
                const wA = priorityWeight[a.prioridade] || 0;
                const wB = priorityWeight[b.prioridade] || 0;
                if (wA !== wB) return wB - wA;
                return new Date(a.data_criacao) - new Date(b.data_criacao);
            });
        } else if (status === 'atendido') {
            atendimentos.sort((a, b) => new Date(b.data_finalizacao) - new Date(a.data_finalizacao));
        }

        return res.json(atendimentos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar atendimentos' });
    }
};

exports.finalizar = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const updateQuery = `
            UPDATE atendimentos 
            SET status = 'atendido', data_finalizacao = CURRENT_TIMESTAMP, usuario_responsavel = $1
            WHERE id = $2
            RETURNING *
        `;

        const result = await db.query(updateQuery, [userId, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Atendimento não encontrado' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao finalizar atendimento' });
    }
};
