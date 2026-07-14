const timeLogRepository = require('../repositories/timeLog.repository');
const taskRepository = require('../repositories/task.repository');
const AppError = require('../utils/AppError');

class TimeLogService {
  async createTimeLog(data, currentUser) {
    const task = await taskRepository.findById(data.taskId);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (currentUser.role === 'freelancer' && task.assignedTo !== currentUser.id) {
      throw new AppError('You can only log time for tasks assigned to you', 403);
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (end <= start) {
      throw new AppError('End time must be after start time', 400);
    }

    const hours = (end - start) / 3600000;
    const computedHours = parseFloat(hours.toFixed(2));

    return await timeLogRepository.create({
      ...data,
      userId: currentUser.id,
      hours: computedHours,
    });
  }

  async getAllTimeLogs(currentUser) {
    if (currentUser.role === 'freelancer') {
      return await timeLogRepository.findAll({ userId: currentUser.id });
    }
    return await timeLogRepository.findAll();
  }

  async getTimeLogById(id, currentUser) {
    const log = await timeLogRepository.findById(id);
    if (!log) {
      throw new AppError('Time log not found', 404);
    }

    if (currentUser.role === 'freelancer' && log.userId !== currentUser.id) {
      throw new AppError('You do not have permission to view this time log', 403);
    }

    return log;
  }

  async updateTimeLog(id, data, currentUser) {
    const log = await timeLogRepository.findById(id);
    if (!log) {
      throw new AppError('Time log not found', 404);
    }

    if (currentUser.role === 'freelancer' && log.userId !== currentUser.id) {
      throw new AppError('You do not have permission to update this time log', 403);
    }

    if (log.isBilled) {
      throw new AppError('Cannot update a billed time log', 400);
    }

    const updateData = { ...data };

    if (data.startTime || data.endTime) {
      const start = new Date(data.startTime || log.startTime);
      const end = new Date(data.endTime || log.endTime);
      if (end <= start) {
        throw new AppError('End time must be after start time', 400);
      }
      const hours = (end - start) / 3600000;
      updateData.hours = parseFloat(hours.toFixed(2));
    }

    return await timeLogRepository.update(id, updateData);
  }

  async deleteTimeLog(id, currentUser) {
    const log = await timeLogRepository.findById(id);
    if (!log) {
      throw new AppError('Time log not found', 404);
    }

    if (currentUser.role === 'freelancer' && log.userId !== currentUser.id) {
      throw new AppError('You do not have permission to delete this time log', 403);
    }

    if (log.isBilled) {
      throw new AppError('Cannot delete a billed time log', 400);
    }

    await timeLogRepository.delete(id);
  }
}

module.exports = new TimeLogService();
