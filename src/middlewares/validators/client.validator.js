const { body, param, validationResult } = require('express-validator');
const AppError = require('../../utils/AppError');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMsg, 400));
  }
  next();
};

const validateCreateClient = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Phone must be between 5 and 20 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Company must be between 2 and 150 characters'),
  handleValidationErrors,
];

const validateUpdateClient = [
  param('id')
    .isUUID()
    .withMessage('Invalid client ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Phone must be between 5 and 20 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Company must be between 2 and 150 characters'),
  handleValidationErrors,
];

const validateClientIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid client ID format'),
  handleValidationErrors,
];

module.exports = {
  validateCreateClient,
  validateUpdateClient,
  validateClientIdParam,
};
