const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Registrar usuario
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Todos os campos sao obrigatorios.'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'A senha deve ter pelo menos 6 caracteres.'
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = db.prepare(
        'SELECT id FROM users WHERE email = ?'
    ).get(normalizedEmail);

    if (existingUser) {
        return res.status(409).json({
            message: 'Este email ja esta cadastrado.'
        });
    }

    // Criar hash seguro da senha
    const salt = crypto.randomBytes(16).toString('hex');

    const passwordHash = crypto.scryptSync(
        password,
        salt,
        64
    ).toString('hex');

    const storedPassword = `${salt}:${passwordHash}`;

    const result = db.prepare(`
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
    `).run(name.trim(), normalizedEmail, storedPassword);

    res.status(201).json({
        message: 'Usuario cadastrado com sucesso!',
        user: {
            id: result.lastInsertRowid,
            name: name.trim(),
            email: normalizedEmail
        }
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email e senha sao obrigatorios.'
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = db.prepare(
        'SELECT * FROM users WHERE email = ?'
    ).get(normalizedEmail);

    if (!user) {
        return res.status(401).json({
            message: 'Email ou senha incorretos.'
        });
    }

    // Verificar a senha
    const [salt, savedHash] = user.password_hash.split(':');

    const passwordHash = crypto.scryptSync(
        password,
        salt,
        64
    ).toString('hex');

    const passwordIsCorrect = crypto.timingSafeEqual(
        Buffer.from(savedHash, 'hex'),
        Buffer.from(passwordHash, 'hex')
    );

    if (!passwordIsCorrect) {
        return res.status(401).json({
            message: 'Email ou senha incorretos.'
        });
    }

    // Criar token da sessao
    const token = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Definir validade de 7 dias
    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    db.prepare(`
        INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES (?, ?, ?)
    `).run(user.id, tokenHash, expiresAt);

    res.json({
        message: 'Login realizado com sucesso!',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
    db.prepare(
        'DELETE FROM sessions WHERE token_hash = ?'
    ).run(req.tokenHash);

    res.json({
        message: 'Logout realizado com sucesso!'
    });
});

module.exports = router;