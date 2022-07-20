const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

// Routes
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query();
    } catch (err) {
        return next(err);
    }
});

// Router
module.exports = router;
