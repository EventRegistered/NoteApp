const express = require('express');
const router = express.Router();
const notes = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(notes.getNotes)
  .post(notes.createNote);

router.route('/:id')
  .get(notes.getNote)
  .put(notes.updateNote)
  .delete(notes.deleteNote);

module.exports = router;