const { User } = require('../models');
const BaseRepository = require('./base.repository');

class AuthRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.scope('withPassword').findOne({ where: { email } });
  }

  async findByIdWithPassword(id) {
    return await this.model.scope('withPassword').findByPk(id);
  }
}

module.exports = new AuthRepository();
