require('dotenv').config();
const db = require('./src/db');
const bcrypt = require('bcrypt');

async function testLogin() {
    try {
        const passwordToTest = 'admin123'; // assuming this is the default
        
        console.log("Checking users...");
        const res = await db.query('SELECT * FROM users WHERE email = $1', ['admin@woloczyn.com.br']);
        const user = res.rows[0];
        
        if (!user) {
            console.log("No user found.");
            process.exit(1);
        }
        
        const isValid = await bcrypt.compare(passwordToTest, user.password_hash);
        console.log(`Password '${passwordToTest}' valid?`, isValid);
        
        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

testLogin();
