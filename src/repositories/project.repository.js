const { Project, Client } = require('../models');
const BaseRepository = require('./base.repository');

class ProjectRepository extends BaseRepository {
  constructor() {
    super(Project);
  }

  async findAll(options = {}) {
    return super.findAll({
      include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'company'] }],
      ...options,
    });
  }

  async findById(id, options = {}) {
    return super.findById(id, {
      include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'company'] }],
      ...options,
    });
  }
}

module.exports = new ProjectRepository();
