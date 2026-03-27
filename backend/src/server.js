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

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
