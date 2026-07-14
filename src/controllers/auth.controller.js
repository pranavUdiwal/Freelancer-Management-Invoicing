const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
