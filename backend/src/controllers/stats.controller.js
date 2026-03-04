const db = require('../db');

exports.getStats = async (req, res) => {
    try {
        // Total counts
        const totalResult = await db.query('SELECT COUNT(*) as total FROM atendimentos');
        const pendingResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE status = 'pendente'");
        const attendedResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE status = 'atendido'");

        const total = parseInt(totalResult.rows[0].total) || 0;
        const attended = parseInt(attendedResult.rows[0].total) || 0;

        // Efficiency: Average Response Time (in hours)
        const avgTimeResult = await db.query(`
            SELECT AVG(EXTRACT(EPOCH FROM (data_finalizacao - data_criacao))/3600) as avg_hours
            FROM atendimentos 
            WHERE status = 'atendido' AND data_finalizacao IS NOT NULL
        `);

        // Lead Potential Calculation
        // Assigning relative values to areas and priorities for "palpable" business metrics
        const potentialResult = await db.query(`
            SELECT SUM(
                CASE 
                    WHEN area_juridica ILIKE '%Trabalhista%' THEN 5000
                    WHEN area_juridica ILIKE '%Criminal%' THEN 6000
                    WHEN area_juridica ILIKE '%Família%' OR area_juridica ILIKE '%Familia%' THEN 4000
                    WHEN area_juridica ILIKE '%Cível%' OR area_juridica ILIKE '%Civel%' THEN 3000
                    ELSE 2000
                END * 
                CASE 
                    WHEN prioridade = 'Alta' THEN 1.5
                    WHEN prioridade IN ('Media', 'Média') THEN 1.0
                    ELSE 0.7
                END
            ) as total_potential
            FROM atendimentos
        `);

        // This week/month
        const weekResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE data_criacao >= date_trunc('week', CURRENT_DATE)");
        const monthResult = await db.query("SELECT COUNT(*) as total FROM atendimentos WHERE data_criacao >= date_trunc('month', CURRENT_DATE)");

        // Contacts per day
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

        const conversionRate = total > 0 ? ((attended / total) * 100).toFixed(1) : 0;

        return res.json({
            summary: {
                total,
                pending: parseInt(pendingResult.rows[0].total) || 0,
                attended,
                thisWeek: parseInt(weekResult.rows[0].total) || 0,
                thisMonth: parseInt(monthResult.rows[0].total) || 0,
                conversionRate: parseFloat(conversionRate),
                avgResponseHours: parseFloat(parseFloat(avgTimeResult.rows[0].avg_hours || 0).toFixed(1)),
                potentialValue: parseFloat(potentialResult.rows[0].total_potential || 0),
            },
            daily: dailyResult.rows.map(r => ({ date: r.date, count: parseInt(r.count) })),
            areas: areaResult.rows.map(r => ({ area: r.area, count: parseInt(r.count) })),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
};
