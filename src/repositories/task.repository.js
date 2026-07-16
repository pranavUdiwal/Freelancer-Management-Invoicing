const { Task, Project, User } = require('../models');
const BaseRepository = require('./base.repository');

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  async findAll(options = {}) {
    return super.findAll({
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'role'] },
      ],
      ...options,
    });
  }

  async findById(id, options = {}) {
    return super.findById(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'role'] },
      ],
      ...options,
    });
  }
}

module.exports = new TaskRepository();
