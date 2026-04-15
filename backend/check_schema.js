const { Client } = require('pg');

async function checkTable() {
    const connectionString = 'postgresql://postgres.ucbtvublthoxuntczevb:aqdEIcuCRxgRoNd1@aws-1-sa-east-1.pooler.supabase.com:6543/postgres';
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log("Conectado ao Supabase.");

        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'agenda_events'
        `);
        console.log("Colunas da tabela agenda_events:");
        res.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

    } catch (err) {
        console.error("Erro:", err.message);
    } finally {
        await client.end();
    }
}

checkTable();
