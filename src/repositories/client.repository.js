const { Client } = require('../models');
const BaseRepository = require('./base.repository');

class ClientRepository extends BaseRepository {
  constructor() {
    super(Client);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }
}

module.exports = new ClientRepository();
