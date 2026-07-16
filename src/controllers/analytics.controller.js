const analyticsService = require('../services/analytics.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class AnalyticsController extends BaseController {
  constructor() {
    super();
    this.service = analyticsService;
  }

  getDashboardStats = catchAsync(async (req, res) => {
    const stats = await this.service.getDashboardStats();
    return this.sendSuccess(res, { stats });
  });
}

module.exports = new AnalyticsController();
