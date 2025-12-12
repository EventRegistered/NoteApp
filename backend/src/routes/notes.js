const { Router } = require('express');
const Joi = require('joi');
const asyncHandler = require('../utils/asyncHandler');

const schema = Joi.object({
  title: Joi.string().max(255).required(),
  body: Joi.string().allow('').optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  body: Joi.string().allow('').optional(),
});

module.exports = ({ db } = {}) => {
  const router = Router();
  const Note = db?.models?.Note;

  // defensive: if Note model not present, return 500 for all routes
  if (!Note) {
    router.use((req, res) => res.status(500).json({ message: 'Note model not available' }));
    return router;
  }

  // list
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const notes = await Note.findAll();
      // normalize DB columns -> API shape
      const out = notes.map((n) => {
        const p = n.get ? n.get({ plain: true }) : n;
        return {
          id: p.NoteId ?? p.id ?? null,
          userId: p.UserId ?? p.userId ?? null,
          title: p.Title ?? p.title ?? null,
          body: p.Content ?? p.Body ?? p.body ?? '',
          deleted: p.Deleted ?? p.deleted ?? 0,
          deletedAt: p.DeletedAt ?? p.deletedAt ?? null,
          createdAt: p.createdAt ?? p.CreatedAt ?? null,
          updatedAt: p.updatedAt ?? p.UpdatedAt ?? null,
        }
      });
      res.json({ data: out });
    })
  );
 
  // create
  router.post(
    '/',
    asyncHandler(async (req, res) => {
      console.debug('[notes] POST /api/notes body:', req.body, 'currentUser:', req.currentUser?.id ?? null)
      
      // allow "body" or "content" from frontend
      const { error, value } = schema.validate(req.body)
      if (error) {
        console.warn('[notes] validation failed:', error.message)
        return res.status(400).json({ message: error.message })
      }
 
      try {
        const userId = req.currentUser?.id ?? req.currentUser?.ID ?? 1

        // map API -> DB column names (DB uses Content)
        const payload = {
          Title: value.title,
          Content: typeof value.body !== 'undefined' ? value.body : (typeof value.content !== 'undefined' ? value.content : ''),
          UserId: userId,
        }
 
        const created = await Note.create(payload)
        const p = created.get ? created.get({ plain: true }) : created
        const out = {
          id: p.NoteId ?? p.id ?? null,
          userId: p.UserId ?? null,
          title: p.Title ?? null,
          body: p.Content ?? p.Body ?? '',
          createdAt: p.createdAt ?? null,
          updatedAt: p.updatedAt ?? null,
        }
        console.info('[notes] created note:', out)
        res.status(201).json({ data: out })
      } catch (err) {
        // Backend error log: stack for debugging
        console.error('[notes] create error:', err && err.stack ? err.stack : err)
        return res.status(500).json({ message: err?.message || 'Internal Server Error' })
      }
    })
  );

  // get one
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const note = await Note.findByPk(req.params.id);
      if (!note) return res.status(404).json({ message: 'Not Found' });
      const plain = note.get ? note.get({ plain: true }) : note;
      res.json({ data: plain });
    })
  );

  // update
  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      const { error, value } = updateSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const note = await Note.findByPk(req.params.id);
      if (!note) return res.status(404).json({ message: 'Not Found' });

      const updates = {};
      if (typeof value.title !== 'undefined') updates.Title = value.title;
      if (typeof value.body !== 'undefined') updates.Body = value.body;

      await note.update(updates);
      const plain = note.get ? note.get({ plain: true }) : note;
      res.json({ data: plain });
    })
  );

  // delete
  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const note = await Note.findByPk(req.params.id);
      if (!note) return res.status(404).json({ message: 'Not Found' });
      await note.destroy();
      res.status(204).send();
    })
  );

  return router;
};