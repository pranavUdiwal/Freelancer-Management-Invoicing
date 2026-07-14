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

const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
  body('assignedTo')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('assignedTo must be a valid UUID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  handleValidationErrors,
];

const validateUpdateTask = [
  param('id')
    .isUUID()
    .withMessage('Invalid task ID format'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('projectId')
    .optional()
    .isUUID()
    .withMessage('projectId must be a valid UUID'),
  body('assignedTo')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('assignedTo must be a valid UUID'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date (YYYY-MM-DD)'),
  handleValidationErrors,
];

const validateTaskIdParam = [
  param('id')
    .isUUID()
    .withMessage('Invalid task ID format'),
  handleValidationErrors,
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateTaskIdParam,
};
