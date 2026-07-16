const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const authRepository = require('../repositories/auth.repository');
const { signToken } = require('../utils/jwt');
const BaseService = require('./base.service');

class AuthService extends BaseService {
  constructor() {
    super(authRepository);
  }

  async register(data) {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.repository.create({
      ...data,
      password: hashedPassword,
    });

    const userJson = user.toJSON();
    delete userJson.password;

    const token = signToken(user.id);
    return { token, user: userJson };
  }

  async login(data) {
    const user = await this.repository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    const userJson = user.toJSON();
    delete userJson.password;

    const token = signToken(user.id);
    return { token, user: userJson };
  }

  async getProfile(userId) {
    return await this.getById(userId);
  }

  async updateProfile(userId, data) {
    if (data.email) {
      const userWithEmail = await this.repository.findByEmail(data.email);
      if (userWithEmail && userWithEmail.id !== userId) {
        throw new AppError('Email is already in use', 400);
      }
    }

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    return await this.update(userId, updateData);
  }

  async changePassword(userId, data) {
    const user = await this.repository.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordCorrect = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.update(userId, { password: hashedPassword });
  }
}

module.exports = new AuthService();
