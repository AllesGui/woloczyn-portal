// Backend Version: 1.0.1 - Redeploy trigger for stats/reabrir updates
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const atendimentoRoutes = require('./routes/atendimento.routes');
const statsRoutes = require('./routes/stats.routes');
const agendaRoutes = require('./routes/agenda.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/atendimentos', atendimentoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/agenda', agendaRoutes);

const PORT = process.env.PORT || 3333;

// Inicialização do Banco (Criar tabela se não existir)
const db = require('./db');
const initTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS agenda_events (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                client VARCHAR(255),
                date DATE NOT NULL,
                time VARCHAR(10) NOT NULL,
                duration INTEGER NOT NULL,
                urgency VARCHAR(50),
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Tabela agenda_events verificada/criada.");
    } catch (err) {
        console.error("❌ Erro ao inicializar tabela da agenda:", err);
    }
};
initTable();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
