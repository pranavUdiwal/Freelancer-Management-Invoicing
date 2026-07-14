const analyticsService = require('../services/analytics.service');
const catchAsync = require('../utils/catchAsync');

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

module.exports = {
  getDashboardStats,
};
