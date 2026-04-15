const { Client } = require('pg');

// Use DATABASE_URL from environment or provide the old connection string as parameter
const oldConnectionString = process.env.OLD_DATABASE_URL || process.env.DATABASE_URL;

async function testOldDb() {
    const client = new Client({
        connectionString: oldConnectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("Tentando conectar ao banco de dados...");
        await client.connect();
        console.log("✅ Conexão estabelecida!");

        console.log("Verificando tabela agenda_events...");
        const res = await client.query("SELECT * FROM agenda_events");
        console.log(`✅ Encontrados ${res.rows.length} eventos.`);
        
        if (res.rows.length > 0) {
            console.log("JSON dos dados:", JSON.stringify(res.rows, null, 2));
        }

    } catch (err) {
        console.error("❌ Erro ao conectar ou buscar dados:", err.message);
    } finally {
        await client.end();
    }
}

testOldDb();
