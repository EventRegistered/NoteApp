const asyncHandler = require('express-async-handler');
const { Note } = require('../models');
const { Op } = require('sequelize');

exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: 'Title required' });

  const note = await Note.create({ UserId: req.user.id, Title: title.trim(), Content: content || '' });
  res.status(201).json({ success: true, data: note });
});

exports.getNotes = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(100, parseInt(req.query.limit || '10', 10));
  const search = req.query.q || '';

  const where = { UserId: req.user.id, Deleted: false };
  if (search) {
    where[Op.or] = [
      { Title: { [Op.like]: `%${search}%` } },
      { Content: { [Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Note.findAndCountAll({ where, limit, offset: (page - 1) * limit, order: [['UpdatedAt', 'DESC']] });

  res.json({ success: true, page, limit, total: count, totalPages: Math.ceil(count / limit), data: rows });
});

exports.getNote = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = await Note.findOne({ where: { NoteId: id, UserId: req.user.id, Deleted: false } });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: note });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = await Note.findOne({ where: { NoteId: id, UserId: req.user.id } });
  if (!note) return res.status(404).json({ message: 'Not found' });

  const { title, content } = req.body;
  await note.update({ Title: title ?? note.Title, Content: content ?? note.Content });
  res.json({ success: true, data: note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = await Note.findOne({ where: { NoteId: id, UserId: req.user.id } });
  if (!note) return res.status(404).json({ message: 'Not found' });

  await note.update({ Deleted: true, DeletedAt: new Date() });
  res.json({ success: true, message: 'Moved to trash' });
});