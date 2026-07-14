const { User } = require('../models');

class AuthRepository {
  async findByEmail(email) {
    return await User.scope('withPassword').findOne({ where: { email } });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByIdWithPassword(id) {
    return await User.scope('withPassword').findByPk(id);
  }

  async updateUser(id, data) {
    const [, [updatedUser]] = await User.update(data, {
      where: { id },
      returning: true,
    });
    return updatedUser;
  }
}

module.exports = new AuthRepository();
