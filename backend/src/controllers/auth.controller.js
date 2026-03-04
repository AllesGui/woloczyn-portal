const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

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
