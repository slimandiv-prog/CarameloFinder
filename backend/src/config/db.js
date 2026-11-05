const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Localizacao do banco de dados
const dbPath = path.join(__dirname, '../../caramelofinder.db');

// Criar ou abrir o banco de dados
const db = new Database(dbPath);

// Ativar a verificacao das chaves estrangeiras
db.pragma('foreign_keys = ON');

// Ler e executar o schema
const schemaPath = path.join(__dirname, '../../sql/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

// Verificar se a coluna user_id ja existe
const columns = db.prepare('PRAGMA table_info(reports)').all();

const hasUserId = columns.some(column => column.name === 'user_id');

// Adicionar a coluna nas bases antigas
if (!hasUserId) {
    db.exec('ALTER TABLE reports ADD COLUMN user_id INTEGER REFERENCES users(id)');
}

module.exports = db;