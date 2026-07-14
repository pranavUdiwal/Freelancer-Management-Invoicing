const { Client } = require('../models');

class ClientRepository {
  async create(data) {
    return await Client.create(data);
  }

  async findAll() {
    return await Client.findAll();
  }

  async findById(id) {
    return await Client.findByPk(id);
  }

  async findByEmail(email) {
    return await Client.findOne({ where: { email } });
  }

  async update(id, data) {
    const [, [updatedClient]] = await Client.update(data, {
      where: { id },
      returning: true,
    });
    return updatedClient;
  }

  async delete(id) {
    return await Client.destroy({ where: { id } });
  }
}

module.exports = new ClientRepository();
