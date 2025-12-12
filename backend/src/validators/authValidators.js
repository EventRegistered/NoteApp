const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[0-9]/, 'number')
  .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 128 characters',
    'string.pattern.name': 'Password must contain at least one {#name}',
    'any.required': 'Password is required'
  });

const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required()
    .messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name must not exceed 150 characters',
      'any.required': 'Full name is required'
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(255)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: passwordSchema
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  passwordSchema
};
