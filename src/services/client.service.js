const clientRepository = require('../repositories/client.repository');
const AppError = require('../utils/AppError');
const BaseService = require('./base.service');

class ClientService extends BaseService {
  constructor() {
    super(clientRepository);
  }

  async create(data) {
    const existingClient = await this.repository.findByEmail(data.email);
    if (existingClient) {
      throw new AppError('Email is already in use by another client', 400);
    }
    return super.create(data);
  }

  async update(id, data) {
    const client = await this.getById(id);
    if (data.email) {
      const existingClient = await this.repository.findByEmail(data.email);
      if (existingClient && existingClient.id !== id) {
        throw new AppError('Email is already in use by another client', 400);
      }
    }
    return super.update(id, data);
  }
}

module.exports = new ClientService();
