const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title must not exceed 255 characters',
      'any.required': 'Title is required'
    }),
  content: Joi.string()
    .allow('')
    .max(50000)
    .default('')
    .messages({
      'string.max': 'Content must not exceed 50000 characters'
    }),
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .optional()
});

const updateNoteSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title must not exceed 255 characters'
    }),
  content: Joi.string()
    .allow('')
    .max(50000)
    .messages({
      'string.max': 'Content must not exceed 50000 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field (title or content) must be provided'
});

const getNotesQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  q: Joi.string()
    .trim()
    .max(100)
    .allow('')
    .default('')
});

const noteIdParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Note ID must be a number',
      'number.positive': 'Note ID must be positive',
      'any.required': 'Note ID is required'
    })
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
  noteIdParamSchema
};
