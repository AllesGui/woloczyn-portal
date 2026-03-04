const { Client } = require('pg');

const connectionString = 'postgresql://woloczyn_db_user:LHXKYcTeKjs9vmX6v6t51dhyrZznDPJK@dpg-d6jola95pdvs73ddj3ug-a.oregon-postgres.render.com/woloczyn_db';

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
