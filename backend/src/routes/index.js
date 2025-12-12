const express = require('express');
const notesRouterFactory = require('./notes');
const authRouterFactory = require('./auth');

module.exports = ({ db, config } = {}) => {
  const router = express.Router();

  // lightweight root info
  router.get('/', (req, res) => res.json({ service: 'notes-api', ok: true }));

  // mount feature routers (each router is a factory accepting deps)
  router.use('/notes', notesRouterFactory({ db, config }));
  router.use('/auth', authRouterFactory({ db, config }));

  return router;
};