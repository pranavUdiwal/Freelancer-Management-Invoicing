const projectRepository = require('../repositories/project.repository');
const clientRepository = require('../repositories/client.repository');
const AppError = require('../utils/AppError');
const BaseService = require('./base.service');

class ProjectService extends BaseService {
  constructor() {
    super(projectRepository);
  }

  async create(data) {
    const client = await clientRepository.findById(data.clientId);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return super.create(data);
  }

  async update(id, data) {
    const project = await this.getById(id);
    if (data.clientId) {
      const client = await clientRepository.findById(data.clientId);
      if (!client) {
        throw new AppError('Client not found', 404);
      }
    }
    return super.update(id, data);
  }
}

module.exports = new ProjectService();
