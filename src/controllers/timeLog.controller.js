const timeLogService = require('../services/timeLog.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class TimeLogController extends BaseController {
  constructor() {
    super();
    this.service = timeLogService;
  }

  createTimeLog = catchAsync(async (req, res) => {
    const timeLog = await this.service.createTimeLog(req.body, req.user);
    return this.sendCreated(res, { timeLog });
  });

  getAllTimeLogs = catchAsync(async (req, res) => {
    const timeLogs = await this.service.getAllTimeLogs(req.user);
    return this.sendSuccess(res, { timeLogs });
  });

  getTimeLogById = catchAsync(async (req, res) => {
    const timeLog = await this.service.getTimeLogById(req.params.id, req.user);
    return this.sendSuccess(res, { timeLog });
  });

  updateTimeLog = catchAsync(async (req, res) => {
    const timeLog = await this.service.updateTimeLog(req.params.id, req.body, req.user);
    return this.sendSuccess(res, { timeLog });
  });

  deleteTimeLog = catchAsync(async (req, res) => {
    await this.service.deleteTimeLog(req.params.id, req.user);
    return this.sendNoContent(res);
  });
}

module.exports = new TimeLogController();
