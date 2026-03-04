const db = require('../db');

// Sync finalized Telegram clients into the atendimentos table
async function syncTelegramClients() {
    try {
        const { rows } = await db.query(`
            SELECT ct.chat_id, ct.primeiro_nome, ct.resumo_ia
            FROM clientes_telegram ct
            WHERE ct.status_triagem = 'concluido'
              AND NOT EXISTS (
                SELECT 1 FROM atendimentos a WHERE a.telegram_chat_id = ct.chat_id
              )
        `);

        for (const client of rows) {
            await db.query(`
                INSERT INTO atendimentos (nome, telefone, area_juridica, prioridade, resumo, status, telegram_chat_id)
                VALUES ($1, $2, $3, $4, $5, 'pendente', $6)
            `, [
                client.primeiro_nome || 'Sem nome',
                client.chat_id,
                'A definir',
                'Media',
                client.resumo_ia || 'Triagem via Telegram (sem resumo)',
                client.chat_id
            ]);

            await db.query(`
                UPDATE clientes_telegram SET status_triagem = 'sincronizado' WHERE chat_id = $1
            `, [client.chat_id]);
        }

        if (rows.length > 0) {
            console.log(`[Sync] ${rows.length} new Telegram client(s) synced to portal.`);
        }
    } catch (err) {
        console.error('[Sync] Error syncing Telegram clients:', err.message);
    }
}

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
        // Sync new Telegram clients before listing
        await syncTelegramClients();

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
