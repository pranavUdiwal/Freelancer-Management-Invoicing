const { Task, Project, User } = require('../models');

class TaskRepository {
  async create(data) {
    return await Task.create(data);
  }

  async findAll(where = {}) {
    return await Task.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'role'] },
      ],
    });
  }

  async findById(id) {
    return await Task.findByPk(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'role'] },
      ],
    });
  }

  async update(id, data) {
    const [, [updatedTask]] = await Task.update(data, {
      where: { id },
      returning: true,
    });
    return updatedTask;
  }

  async delete(id) {
    return await Task.destroy({ where: { id } });
  }
}

module.exports = new TaskRepository();
