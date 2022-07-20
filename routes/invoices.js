const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

// Routes

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            `SELECT invoices.id, 
			invoices.amt, 
			invoices.paid,
			invoices.add_date,
			invoices.paid_date,
			companies.code,
			companies.name,
			companies.description
			FROM invoices
			INNER JOIN companies
			ON invoices.comp_code=companies.code
			WHERE id=$1`,
            [id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(
                `Invoice with id of ${id} does not exist.`,
                404
            );
        }
        return res.send({ invoice: results.rows[0] });
    } catch (err) {
        return next(err);
    }
});

// Router
module.exports = router;
