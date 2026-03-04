const db = require('../db');

exports.getStats = async (req, res) => {
    try {
        // Total counts
        const totalResult = await db.query('SELECT COUNT(*) as total FROM atendimentos');
        const pendingResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE status = 'pendente'");
        const attendedResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE status = 'atendido'");

        // This week
        const weekResult = await db.query(`
            SELECT COUNT(*) as total FROM atendimentos 
            WHERE data_criacao >= date_trunc('week', CURRENT_DATE)
        `);

        // This month
        const monthResult = await db.query(`
            SELECT COUNT(*) as total FROM atendimentos 
            WHERE data_criacao >= date_trunc('month', CURRENT_DATE)
        `);

        // Contacts per day (last 30 days)
        const dailyResult = await db.query(`
            SELECT DATE(data_criacao) as date, COUNT(*) as count
            FROM atendimentos
            WHERE data_criacao >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(data_criacao)
            ORDER BY date ASC
        `);

        // Area breakdown
        const areaResult = await db.query(`
            SELECT area_juridica as area, COUNT(*) as count
            FROM atendimentos
            GROUP BY area_juridica
            ORDER BY count DESC
        `);

        // Priority distribution
        const priorityResult = await db.query(`
            SELECT prioridade as priority, COUNT(*) as count
            FROM atendimentos
            GROUP BY prioridade
            ORDER BY count DESC
        `);

        // Recent activity (last 10)
        const recentResult = await db.query(`
            SELECT nome, area_juridica, prioridade, status, data_criacao
            FROM atendimentos
            ORDER BY data_criacao DESC
            LIMIT 10
        `);

        return res.json({
            summary: {
                total: parseInt(totalResult.rows[0].total),
                pending: parseInt(pendingResult.rows[0].total),
                attended: parseInt(attendedResult.rows[0].total),
                thisWeek: parseInt(weekResult.rows[0].total),
                thisMonth: parseInt(monthResult.rows[0].total),
            },
            daily: dailyResult.rows.map(r => ({ date: r.date, count: parseInt(r.count) })),
            areas: areaResult.rows.map(r => ({ area: r.area, count: parseInt(r.count) })),
            priorities: priorityResult.rows.map(r => ({ priority: r.priority, count: parseInt(r.count) })),
            recent: recentResult.rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
