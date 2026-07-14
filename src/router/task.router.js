const express = require('express');
const taskController = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const {
  validateCreateTask,
  validateUpdateTask,
  validateTaskIdParam,
} = require('../middlewares/validators/task.validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin', 'manager'), validateCreateTask, taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route('/:id')
  .get(validateTaskIdParam, taskController.getTaskById)
  .patch(validateUpdateTask, taskController.updateTask)
  .delete(restrictTo('admin', 'manager'), validateTaskIdParam, taskController.deleteTask);

module.exports = router;
