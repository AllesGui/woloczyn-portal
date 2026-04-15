const { Client } = require('pg');

// Use DATABASE_URL from environment or local .env file
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost/woloczyn_db';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function verify() {
    try {
        await client.connect();
        const res = await client.query('SELECT name, email, password_hash FROM users WHERE email = $1', ['admin@woloczyn.com.br']);
        console.log('User found:', res.rows[0]);
    } finally {
        await client.end();
    }
}

verify();
