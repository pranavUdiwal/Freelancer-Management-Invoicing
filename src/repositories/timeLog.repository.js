const { TimeLog, Task } = require('../models');

class TimeLogRepository {
  async create(data) {
    return await TimeLog.create(data);
  }

  async findAll(where = {}) {
    return await TimeLog.findAll({
      where,
      include: [{ model: Task, as: 'task', attributes: ['id', 'title'] }],
    });
  }

  async findById(id) {
    return await TimeLog.findByPk(id, {
      include: [{ model: Task, as: 'task', attributes: ['id', 'title'] }],
    });
  }

  async update(id, data, options = {}) {
    const [, [updatedTimeLog]] = await TimeLog.update(data, {
      where: { id },
      returning: true,
      ...options,
    });
    return updatedTimeLog;
  }

  async delete(id) {
    return await TimeLog.destroy({ where: { id } });
  }
}

module.exports = new TimeLogRepository();
