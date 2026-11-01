
const express = require('express');
const router = express.Router();

const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Listar todos os relatos (publico)
router.get('/', (req, res) => {
    const reports = db.prepare(
        'SELECT * FROM reports ORDER BY id DESC'
    ).all();

    res.json(reports);
});

// Listar relatos do usuario autenticado
router.get('/my-reports', authMiddleware, (req, res) => {
    const reports = db.prepare(
        'SELECT * FROM reports WHERE user_id = ? ORDER BY id DESC'
    ).all(req.user.id);

    res.json(reports);
});

// Consultar um relato (publico)
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'ID invalido'
        });
    }

    const report = db.prepare(
        'SELECT * FROM reports WHERE id = ?'
    ).get(id);

    if (!report) {
        return res.status(404).json({
            error: 'Relato nao encontrado'
        });
    }

    res.json(report);
});

// Cadastrar novo relato (requer login)
router.post('/', authMiddleware, (req, res) => {
    const {
        animal_name,
        animal_type,
        description,
        location,
        report_date,
        contact_name,
        contact_phone,
        image_url
    } = req.body;

    if (
        !animal_name ||
        !['lost', 'found'].includes(animal_type) ||
        !location ||
        !report_date ||
        !contact_name ||
        !contact_phone
    ) {
        return res.status(400).json({
            error: 'Preencha os campos obrigatorios corretamente'
        });
    }

    const insert = db.prepare(`
        INSERT INTO reports (
            user_id,
            animal_name,
            animal_type,
            description,
            location,
            report_date,
            contact_name,
            contact_phone,
            image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
        req.user.id,
        animal_name,
        animal_type,
        description || '',
        location,
        report_date,
        contact_name,
        contact_phone,
        image_url || ''
    );

    res.status(201).json({
        message: 'Relato cadastrado com sucesso!',
        id: result.lastInsertRowid
    });
});

// Atualizar um relato (somente o proprietario)
router.put('/:id', authMiddleware, (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'ID invalido.'
        });
    }

    const existingReport = db.prepare(
        'SELECT * FROM reports WHERE id = ? AND user_id = ?'
    ).get(id, req.user.id);

    if (!existingReport) {
        return res.status(404).json({
            error: 'Relato nao encontrado'
        });
    }

    const {
        animal_name,
        animal_type,
        description,
        location,
        report_date,
        contact_name,
        contact_phone,
        image_url,
        status
    } = req.body;

    if (
        !animal_name ||
        !['lost', 'found'].includes(animal_type) ||
        !location ||
        !report_date ||
        !contact_name ||
        !contact_phone ||
        (status && !['active', 'resolved'].includes(status))
    ) {
        return res.status(400).json({
            error: 'Dados invalidos ou campos obrigatorios ausentes'
        });
    }

    db.prepare(`
        UPDATE reports
        SET animal_name = ?,
            animal_type = ?,
            description = ?,
            location = ?,
            report_date = ?,
            contact_name = ?,
            contact_phone = ?,
            image_url = ?,
            status = ?
        WHERE id = ? AND user_id = ?
    `).run(
        animal_name,
        animal_type,
        description || '',
        location,
        report_date,
        contact_name,
        contact_phone,
        image_url || '',
        status || existingReport.status,
        id,
        req.user.id
    );

    res.json({
        message: 'Relato atualizado com sucesso!'
    });
});

// Excluir um relato (somente o proprietario)
router.delete('/:id', authMiddleware, (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'ID invalido'
        });
    }

    const result = db.prepare(
        'DELETE FROM reports WHERE id = ? AND user_id = ?'
    ).run(id, req.user.id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Relato nao encontrado'
        });
    }

    res.json({
        message: 'Relato excluido com sucesso!'
    });
});

module.exports = router;
