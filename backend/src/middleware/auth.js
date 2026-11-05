const crypto = require('crypto');
const db = require('../config/db');

function authMiddleware(req, res, next) {
    // Receber o token enviado pelo frontend
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Autenticacao necessaria.'
        });
    }

    const token = authHeader.split(' ')[1];

    // Criar o hash do token para consultar o banco
    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Procurar a sessao no banco de dados
    const session = db.prepare(`
        SELECT sessions.user_id, users.name, users.email
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ?
        AND sessions.expires_at > ?
    `).get(tokenHash, new Date().toISOString());

    if (!session) {
        return res.status(401).json({
            message: 'Sessao invalida ou expirada.'
        });
    }

    // Disponibilizar os dados do usuario nas rotas
    req.user = {
        id: session.user_id,
        name: session.name,
        email: session.email
    };

    req.tokenHash = tokenHash;

    next();
}

module.exports = authMiddleware;