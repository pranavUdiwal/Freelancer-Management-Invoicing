const timeLogService = require('../services/timeLog.service');
const catchAsync = require('../utils/catchAsync');

const createTimeLog = catchAsync(async (req, res) => {
  const timeLog = await timeLogService.createTimeLog(req.body, req.user);
  res.status(201).json({
    status: 'success',
    data: { timeLog },
  });
});

const getAllTimeLogs = catchAsync(async (req, res) => {
  const timeLogs = await timeLogService.getAllTimeLogs(req.user);
  res.status(200).json({
    status: 'success',
    data: { timeLogs },
  });
});

const getTimeLogById = catchAsync(async (req, res) => {
  const timeLog = await timeLogService.getTimeLogById(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: { timeLog },
  });
});

const updateTimeLog = catchAsync(async (req, res) => {
  const timeLog = await timeLogService.updateTimeLog(req.params.id, req.body, req.user);
  res.status(200).json({
    status: 'success',
    data: { timeLog },
  });
});

const deleteTimeLog = catchAsync(async (req, res) => {
  await timeLogService.deleteTimeLog(req.params.id, req.user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createTimeLog,
  getAllTimeLogs,
  getTimeLogById,
  updateTimeLog,
  deleteTimeLog,
};
