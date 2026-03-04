const { Client } = require('pg');

const connectionString = 'postgresql://woloczyn_db_user:LHXKYcTeKjs9vmX6v6t51dhyrZznDPJK@dpg-d6jola95pdvs73ddj3ug-a.oregon-postgres.render.com/woloczyn_db';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function fix() {
    try {
        await client.connect();
        const newHash = '$2b$10$Kp6rcBaakt/ZlbcnAIt.ruCAcj7bTZuvjZfF6slimaEHkT5EiEMKG';
        await client.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, 'admin@woloczyn.com.br']);
        console.log('Fixed!');
    } finally {
        await client.end();
    }
}

fix();
