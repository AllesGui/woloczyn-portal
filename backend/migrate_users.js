require('dotenv').config();
const db = require('./src/db');

async function migrateUsers() {
    try {
        console.log("Adicionando colunas de segurança na tabela users...");
        await db.query(`
            ALTER TABLE public.users
            ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
        `);
        console.log("Migração concluída com sucesso!");
    } catch (err) {
        console.error("Erro na migração:", err);
    } finally {
        process.exit(0);
    }
}

migrateUsers();
