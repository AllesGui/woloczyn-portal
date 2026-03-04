const { Client } = require('pg');

const connectionString = 'postgresql://woloczyn_db_user:LHXKYcTeKjs9vmX6v6t51dhyrZznDPJK@dpg-d6jola95pdvs73ddj3ug-a.oregon-postgres.render.com/woloczyn_db';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function check() {
    try {
        await client.connect();
        console.log('Connected to remote database');

        const res = await client.query('SELECT name, email FROM users');
        console.log('Users in database:', res.rows);
    } catch (err) {
        console.error('Error checking database:', err);
    } finally {
        await client.end();
    }
}

check();
