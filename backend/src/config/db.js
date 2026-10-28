const Database = require ('better-sqlite3');
const path = require ('path');

//Localizacao do arquivo do banco de dados
const dbPath = path.join(__dirname, '../../caramelofinder.db');

//Cria ou abre o banco de dados
const db = new Database(dbPath);

//Ativa a verificacao das chaves estrangeiras
db.pragma('foreign_keys = ON');

module.exports = db;