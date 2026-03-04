const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDB() {
    console.log("Conectando ao banco...");
    const client = new Client({
        user: 'guilherme.alles',
        host: 'localhost',
        database: 'wolczyn_db',
        password: '@Uil061320',
        port: 5432,
    });

    try {
        await client.connect();
        console.log("Conectado! Lendo schema.sql...");

        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executando queries...");
        await client.query(schema);

        console.log("Tabelas criadas e usuário administrador inserido com sucesso!");
    } catch (err) {
        console.error("Erro ao inicializar o banco de dados:", err);
    } finally {
        await client.end();
        console.log("Conexão encerrada.");
    }
}

initDB();
