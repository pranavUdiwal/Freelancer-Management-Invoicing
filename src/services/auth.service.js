const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const authRepository = require('../repositories/auth.repository');
const { signToken } = require('../utils/jwt');

class AuthService {
  async register(data) {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const userJson = user.toJSON();
    delete userJson.password;

    const token = signToken(user.id);
    return { token, user: userJson };
  }

  async login(data) {
    const user = await authRepository.findByEmail(data.email);
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
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId, data) {
    if (data.email) {
      const userWithEmail = await authRepository.findByEmail(data.email);
      if (userWithEmail && userWithEmail.id !== userId) {
        throw new AppError('Email is already in use', 400);
      }
    }

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    await authRepository.updateUser(userId, updateData);
    return await authRepository.findById(userId);
  }

  async changePassword(userId, data) {
    const user = await authRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordCorrect = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await authRepository.updateUser(userId, { password: hashedPassword });
  }
}

module.exports = new AuthService();
