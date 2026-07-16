class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(where, options = {}) {
    return this.model.findOne({ where, ...options });
  }

  async create(data, options = {}) {
    return this.model.create(data, options);
  }

  async update(id, data, options = {}) {
    const [, [updatedRecord]] = await this.model.update(data, {
      where: { id },
      returning: true,
      ...options,
    });
    return updatedRecord;
  }

  async delete(id, options = {}) {
    return this.model.destroy({ where: { id }, ...options });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }

  async findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }
}

module.exports = BaseRepository;
