const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = verifyToken(token);

  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('User no longer exists', 401));
  }

  if (!currentUser.isActive) {
    return next(new AppError('Account is deactivated', 403));
  }

  req.user = currentUser;
  next();
});

module.exports = { protect };
