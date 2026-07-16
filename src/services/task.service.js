const taskRepository = require('../repositories/task.repository');
const projectRepository = require('../repositories/project.repository');
const authRepository = require('../repositories/auth.repository');
const AppError = require('../utils/AppError');
const BaseService = require('./base.service');

class TaskService extends BaseService {
  constructor() {
    super(taskRepository);
  }

  async create(data) {
    const project = await projectRepository.findById(data.projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (data.assignedTo) {
      const user = await authRepository.findById(data.assignedTo);
      if (!user) {
        throw new AppError('Assigned user not found', 404);
      }
      if (!user.isActive) {
        throw new AppError('Assigned user account is deactivated', 400);
      }
    }

    return super.create(data);
  }

  async getAllTasks(currentUser) {
    if (currentUser.role === 'freelancer') {
      return await this.repository.findAll({ assignedTo: currentUser.id });
    }
    return await super.getAll();
  }

  async getTaskById(id, currentUser) {
    const task = await super.getById(id);

    if (currentUser.role === 'freelancer' && task.assignedTo !== currentUser.id) {
      throw new AppError('You do not have permission to view this task', 403);
    }

    return task;
  }

  async updateTask(id, data, currentUser) {
    const task = await super.getById(id);

    if (currentUser.role === 'freelancer') {
      if (task.assignedTo !== currentUser.id) {
        throw new AppError('You can only update tasks assigned to you', 403);
      }

      const allowedFields = ['status', 'priority'];
      const incomingKeys = Object.keys(data);
      const isSubset = incomingKeys.every((key) => allowedFields.includes(key));
      if (!isSubset) {
        throw new AppError('Freelancers can only update task status or priority', 403);
      }
    }

    if (data.projectId) {
      const project = await projectRepository.findById(data.projectId);
      if (!project) {
        throw new AppError('Project not found', 404);
      }
    }

    if (data.assignedTo) {
      const user = await authRepository.findById(data.assignedTo);
      if (!user) {
        throw new AppError('Assigned user not found', 404);
      }
      if (!user.isActive) {
        throw new AppError('Assigned user account is deactivated', 400);
      }
    }

    return await super.update(id, data);
  }
}

module.exports = new TaskService();
