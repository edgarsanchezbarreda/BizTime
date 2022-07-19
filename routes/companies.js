const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(
            `SELECT * FROM companies WHERE code=$1`,
            [code]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(
                `Company with code of ${code} does not exist.`,
                404
            );
        }
        return res.send({
            company: results.rows[0],
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [code, name, description]
        );
        return res.status(201).json({ company: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
