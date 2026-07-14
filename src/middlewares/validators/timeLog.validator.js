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

const validateCreateTimeLog = [
  body('taskId')
    .isUUID()
    .withMessage('taskId must be a valid UUID'),
  body('startTime')
    .notEmpty()
    .withMessage('startTime is required')
    .isISO8601()
    .withMessage('startTime must be a valid ISO8601 timestamp'),
  body('endTime')
    .notEmpty()
    .withMessage('endTime is required')
    .isISO8601()
    .withMessage('endTime must be a valid ISO8601 timestamp'),
  body('description')
    .optional()
    .trim(),
  handleValidationErrors,
];

const validateUpdateTimeLog = [
  param('id')
    .isUUID()
    .withMessage('Invalid time log ID format'),
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('startTime must be a valid ISO8601 timestamp'),
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('endTime must be a valid ISO8601 timestamp'),
  body('description')
    .optional()
    .trim(),
  handleValidationErrors,
];

const validateTimeLogIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid time log ID format'),
  handleValidationErrors,
];

module.exports = {
  validateCreateTimeLog,
  validateUpdateTimeLog,
  validateTimeLogIdParam,
};
