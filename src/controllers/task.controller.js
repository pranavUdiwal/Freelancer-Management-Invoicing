const taskService = require('../services/task.service');
const catchAsync = require('../utils/catchAsync');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json({
    status: 'success',
    data: { task },
  });
});

const getAllTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.getAllTasks(req.user);
  res.status(200).json({
    status: 'success',
    data: { tasks },
  });
});

const getTaskById = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  res.status(200).json({
    status: 'success',
    data: { task },
  });
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
