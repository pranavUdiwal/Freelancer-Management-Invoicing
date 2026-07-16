const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = authService;
  }

  register = catchAsync(async (req, res) => {
    const result = await this.service.register(req.body);
    return this.sendCreated(res, result);
  });

  login = catchAsync(async (req, res) => {
    const result = await this.service.login(req.body);
    return this.sendSuccess(res, result);
  });

  getProfile = catchAsync(async (req, res) => {
    const user = await this.service.getProfile(req.user.id);
    return this.sendSuccess(res, { user });
  });

  updateProfile = catchAsync(async (req, res) => {
    const updatedUser = await this.service.updateProfile(req.user.id, req.body);
    return this.sendSuccess(res, { user: updatedUser });
  });

  changePassword = catchAsync(async (req, res) => {
    await this.service.changePassword(req.user.id, req.body);
    return this.sendSuccess(res, null, 200, 'Password updated successfully');
  });
}

module.exports = new AuthController();
