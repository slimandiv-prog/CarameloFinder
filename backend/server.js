const express = require ('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./src/config/db');
const reportsRoutes = require('./src/routes/reports.routes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/reports', reportsRoutes);

// Criar a tabela usando o arquivo schema.sql
const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema);

// Rota inicial para verificar se a API esta funcionando
app.get('/',(req, res) => {
    res.json({
        message: 'API do CarameloFinder funcionando!'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});