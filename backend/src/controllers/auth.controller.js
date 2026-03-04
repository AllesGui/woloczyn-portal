const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('--- Login Debug ---');
        console.log('Attempting login for:', email);
        console.log('JWT_SECRET defined:', !!process.env.JWT_SECRET);

        const result = await db.query('SELECT * FROM users WHERE TRIM(email) = TRIM($1)', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log('DEBUG: User not found in database');
            return res.status(401).json({ error: 'User not found' });
        }

        console.log('DEBUG: User found, checking password...');
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            console.log('DEBUG: Password mismatch');
            return res.status(401).json({ error: 'Invalid password' });
        }

        console.log('DEBUG: Login successful, generating token...');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '8h',
        });

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
