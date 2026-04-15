require('dotenv').config();
const db = require('./src/db');

async function checkUsers() {
    try {
        console.log("Checking users table...");
        const res = await db.query('SELECT id, name, email FROM users');
        console.log("Users found:", res.rows);
        process.exit(0);
    } catch (err) {
        console.error("Error checking users:", err.message);
        process.exit(1);
    }
}

checkUsers();
