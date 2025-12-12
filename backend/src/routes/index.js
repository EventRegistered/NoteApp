const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/notes', require('./notes'));

router.get('/health', (req, res) => res.json({ ok: true }));

module.exports = router;