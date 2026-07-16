const { TimeLog, Task } = require('../models');
const BaseRepository = require('./base.repository');

class TimeLogRepository extends BaseRepository {
  constructor() {
    super(TimeLog);
  }

  async findAll(options = {}) {
    return super.findAll({
      include: [{ model: Task, as: 'task', attributes: ['id', 'title'] }],
      ...options,
    });
  }

  async findById(id, options = {}) {
    return super.findById(id, {
      include: [{ model: Task, as: 'task', attributes: ['id', 'title'] }],
      ...options,
    });
  }
}

module.exports = new TimeLogRepository();
