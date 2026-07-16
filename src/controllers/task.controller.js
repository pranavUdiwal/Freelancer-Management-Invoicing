const taskService = require('../services/task.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class TaskController extends BaseController {
  constructor() {
    super();
    this.service = taskService;
  }

  createTask = catchAsync(async (req, res) => {
    const task = await this.service.create(req.body);
    return this.sendCreated(res, { task });
  });

  getAllTasks = catchAsync(async (req, res) => {
    const tasks = await this.service.getAllTasks(req.user);
    return this.sendSuccess(res, { tasks });
  });

  getTaskById = catchAsync(async (req, res) => {
    const task = await this.service.getTaskById(req.params.id, req.user);
    return this.sendSuccess(res, { task });
  });

  updateTask = catchAsync(async (req, res) => {
    const task = await this.service.updateTask(req.params.id, req.body, req.user);
    return this.sendSuccess(res, { task });
  });

  deleteTask = catchAsync(async (req, res) => {
    await this.service.delete(req.params.id);
    return this.sendNoContent(res);
  });
}

module.exports = new TaskController();
