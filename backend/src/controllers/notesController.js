const asyncHandler = require('express-async-handler');
const { Note } = require('../models');
const { Op } = require('sequelize');

exports.createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({ 
    UserId: req.user.id, 
    Title: title, 
    Content: content || '' 
  });
  
  res.status(201).json({ success: true, data: note });
});

exports.getNotes = asyncHandler(async (req, res) => {
  const { page, limit, q: search } = req.query;

  const where = { UserId: req.user.id, Deleted: false };
  if (search) {
    where[Op.or] = [
      { Title: { [Op.iLike]: `%${search}%` } },
      { Content: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Note.findAndCountAll({ 
    where, 
    limit, 
    offset: (page - 1) * limit, 
    order: [['updatedAt', 'DESC']] 
  });

  res.json({ 
    success: true, 
    page, 
    limit, 
    total: count, 
    totalPages: Math.ceil(count / limit), 
    data: rows 
  });
});

exports.getNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const note = await Note.findOne({ 
    where: { NoteId: id, UserId: req.user.id, Deleted: false } 
  });
  
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  
  res.json({ success: true, data: note });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  const note = await Note.findOne({ 
    where: { NoteId: id, UserId: req.user.id } 
  });
  
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  await note.update({ 
    Title: title ?? note.Title, 
    Content: content ?? note.Content 
  });
  
  res.json({ success: true, data: note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const note = await Note.findOne({ 
    where: { NoteId: id, UserId: req.user.id } 
  });
  
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  await note.update({ Deleted: true, DeletedAt: new Date() });
  
  res.json({ success: true, message: 'Note moved to trash' });
});

exports.restoreNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const note = await Note.findOne({ 
    where: { NoteId: id, UserId: req.user.id, Deleted: true } 
  });
  
  if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });

  await note.update({ Deleted: false, DeletedAt: null });
  
  res.json({ success: true, data: note });
});

exports.getTrash = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const { count, rows } = await Note.findAndCountAll({ 
    where: { UserId: req.user.id, Deleted: true },
    limit: Math.min(100, parseInt(limit, 10)),
    offset: (parseInt(page, 10) - 1) * Math.min(100, parseInt(limit, 10)),
    order: [['DeletedAt', 'DESC']] 
  });

  res.json({ 
    success: true, 
    page: parseInt(page, 10), 
    limit: Math.min(100, parseInt(limit, 10)), 
    total: count, 
    totalPages: Math.ceil(count / Math.min(100, parseInt(limit, 10))), 
    data: rows 
  });
});

exports.permanentDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const note = await Note.findOne({ 
    where: { NoteId: id, UserId: req.user.id, Deleted: true } 
  });
  
  if (!note) return res.status(404).json({ success: false, message: 'Note not found in trash' });

  await note.destroy();
  
  res.json({ success: true, message: 'Note permanently deleted' });
});
