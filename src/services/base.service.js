const AppError = require('../utils/AppError');

class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll(options = {}) {
    return this.repository.findAll(options);
  }

  async getById(id, options = {}) {
    const record = await this.repository.findById(id, options);
    if (!record) {
      throw new AppError('Record not found.', 404);
    }
    return record;
  }

  async create(data, options = {}) {
    return this.repository.create(data, options);
  }

  async update(id, data, options = {}) {
    await this.getById(id, options);
    return this.repository.update(id, data, options);
  }

  async delete(id, options = {}) {
    await this.getById(id, options);
    return this.repository.delete(id, options);
  }
}

module.exports = BaseService;
