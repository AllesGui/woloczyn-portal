require('dotenv').config();
const db = require('./src/db');

async function checkDb() {
    try {
        console.log("Checking clientes_telegram...");
        const resTele = await db.query('SELECT * FROM clientes_telegram LIMIT 5');
        console.log("clientes_telegram rows:", resTele.rows);

        console.log("\nChecking atendimentos...");
        const resAtend = await db.query('SELECT * FROM atendimentos LIMIT 5');
        console.log("atendimentos rows:", resAtend.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDb();
