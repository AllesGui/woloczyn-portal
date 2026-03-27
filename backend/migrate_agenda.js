const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'guilherme.alles',
    host: 'localhost',
    database: 'wolczyn_db',
    password: '@Uil061320',
    port: 5432,
});

async function migrate() {
    try {
        console.log("Criando tabela agenda_events...");
        await pool.query(`
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
        console.log("Tabela agenda_events criada com sucesso!");
    } catch (err) {
        console.error("Erro na migração:", err);
    } finally {
        await pool.end();
    }
}

migrate();
