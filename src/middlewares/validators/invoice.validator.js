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

const validateGenerateInvoice = [
  body('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
  body('hourlyRate')
    .notEmpty()
    .withMessage('hourlyRate is required')
    .isDecimal()
    .withMessage('hourlyRate must be a valid number')
    .custom((val) => parseFloat(val) > 0)
    .withMessage('hourlyRate must be a positive number'),
  body('taxRate')
    .optional()
    .isDecimal()
    .withMessage('taxRate must be a valid number')
    .custom((val) => parseFloat(val) >= 0)
    .withMessage('taxRate must be a non-negative number'),
  body('dueDate')
    .notEmpty()
    .withMessage('dueDate is required')
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  body('notes')
    .optional()
    .trim(),
  handleValidationErrors,
];

const validateUpdateInvoiceStatus = [
  param('id')
    .isUUID()
    .withMessage('Invalid invoice ID format'),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['draft', 'sent', 'paid', 'cancelled'])
    .withMessage('status must be one of draft, sent, paid, or cancelled'),
  handleValidationErrors,
];

const validateInvoiceIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid invoice ID format'),
  handleValidationErrors,
];

module.exports = {
  validateGenerateInvoice,
  validateUpdateInvoiceStatus,
  validateInvoiceIdParam,
};
