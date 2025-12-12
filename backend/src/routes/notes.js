const express = require('express');
const router = express.Router();
const notes = require('../controllers/notesController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
  noteIdParamSchema
} = require('../validators/notesValidators');

router.use(protect);

router.route('/')
  .get(validate(getNotesQuerySchema, 'query'), notes.getNotes)
  .post(validate(createNoteSchema), notes.createNote);

router.route('/:id')
  .get(validate(noteIdParamSchema, 'params'), notes.getNote)
  .put(validate(noteIdParamSchema, 'params'), validate(updateNoteSchema), notes.updateNote)
  .delete(validate(noteIdParamSchema, 'params'), notes.deleteNote);

router.get('/trash/list', notes.getTrash);
router.post('/:id/restore', validate(noteIdParamSchema, 'params'), notes.restoreNote);
router.delete('/:id/permanent', validate(noteIdParamSchema, 'params'), notes.permanentDelete);

module.exports = router;
