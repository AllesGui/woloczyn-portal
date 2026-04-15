const { Client } = require('pg');

// Use DATABASE_URL from environment or local .env file
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost/woloczyn_db';

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
