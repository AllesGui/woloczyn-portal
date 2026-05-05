const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateStrongPassword = (password) => {
    const minLength = /.{6,}/;
    const hasLetter = /[a-zA-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecial = /[^a-zA-Z0-9]/;
    return minLength.test(password) && hasLetter.test(password) && hasNumber.test(password) && hasSpecial.test(password);
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query('SELECT * FROM users WHERE TRIM(email) = TRIM($1)', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(401).json({ error: 'Sua conta está bloqueada devido a múltiplas tentativas. Tente novamente mais tarde.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            const newAttempts = (user.failed_login_attempts || 0) + 1;
            if (newAttempts >= 3) {
                const lockedUntil = new Date(Date.now() + 15 * 60000);
                await db.query('UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3', [newAttempts, lockedUntil, user.id]);
                return res.status(401).json({ error: 'Sua conta foi bloqueada por 15 minutos devido a múltiplas tentativas falhas.' });
            } else {
                await db.query('UPDATE users SET failed_login_attempts = $1 WHERE id = $2', [newAttempts, user.id]);
                return res.status(401).json({ error: `Credenciais inválidas. Você tem mais ${3 - newAttempts} tentativa(s) antes do bloqueio.` });
            }
        }

        await db.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1', [user.id]);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '8h',
        });

        if (user.must_change_password) {
            return res.json({
                requirePasswordChange: true,
                user: { id: user.id, name: user.name, email: user.email },
                token
            });
        }

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
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.userId;

        if (!validateStrongPassword(newPassword)) {
            return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres, contendo letras, números e caracteres especiais.' });
        }

        const password_hash = await bcrypt.hash(newPassword, 10);

        await db.query(`
            UPDATE users 
            SET password_hash = $1, must_change_password = false 
            WHERE id = $2
        `, [password_hash, userId]);

        return res.json({ message: 'Senha atualizada com sucesso.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao atualizar a senha.' });
    }
};
