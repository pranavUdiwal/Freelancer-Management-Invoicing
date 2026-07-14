const express = require('express');
const timeLogController = require('../controllers/timeLog.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validateCreateTimeLog,
  validateUpdateTimeLog,
  validateTimeLogIdParam,
} = require('../middlewares/validators/timeLog.validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validateCreateTimeLog, timeLogController.createTimeLog)
  .get(timeLogController.getAllTimeLogs);

router
  .route('/:id')
  .get(validateTimeLogIdParam, timeLogController.getTimeLogById)
  .patch(validateUpdateTimeLog, timeLogController.updateTimeLog)
  .delete(validateTimeLogIdParam, timeLogController.deleteTimeLog);

module.exports = router;
