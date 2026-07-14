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

const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('clientId')
    .isUUID()
    .withMessage('clientId must be a valid UUID'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required')
    .isDecimal()
    .withMessage('Budget must be a valid number')
    .custom((val) => parseFloat(val) >= 0)
    .withMessage('Budget must be a positive number'),
  body('startDate')
    .notEmpty()
    .withMessage('startDate is required')
    .isISO8601()
    .withMessage('startDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed', 'on_hold'])
    .withMessage('Invalid status value'),
  handleValidationErrors,
];

const validateUpdateProject = [
  param('id')
    .isUUID()
    .withMessage('Invalid project ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('clientId')
    .optional()
    .isUUID()
    .withMessage('clientId must be a valid UUID'),
  body('budget')
    .optional()
    .isDecimal()
    .withMessage('Budget must be a valid number')
    .custom((val) => parseFloat(val) >= 0)
    .withMessage('Budget must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed', 'on_hold'])
    .withMessage('Invalid status value'),
  handleValidationErrors,
];

const validateProjectIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid project ID format'),
  handleValidationErrors,
];

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateProjectIdParam,
};
