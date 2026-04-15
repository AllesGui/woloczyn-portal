const { Client } = require('pg');

// Use DATABASE_URL from environment or local .env file
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost/woloczyn_db';

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
