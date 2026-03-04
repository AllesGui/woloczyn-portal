const { Client } = require('pg');

const connectionString = 'postgresql://woloczyn_db_user:LHXKYcTeKjs9vmX6v6t51dhyrZznDPJK@dpg-d6jola95pdvs73ddj3ug-a.oregon-postgres.render.com/woloczyn_db';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function reset() {
    try {
        await client.connect();
        console.log('Connected to remote database');

        // Hash bcrypt para 'admin123'
        const newHash = '$2b$10$wT//qS47zG80EwVqVw97/.t9Jk.M/lMw3yAIFvI/7D305.X2LqVyO';

        await client.query('UPDATE users SET password_hash = $1 WHERE email = $2', [newHash, 'admin@woloczyn.com.br']);
        console.log('Admin password hash updated successfully!');
    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        await client.end();
    }
}

reset();
