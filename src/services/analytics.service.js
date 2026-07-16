const BaseService = require('./base.service');
const analyticsRepository = require('../repositories/analytics.repository');

class AnalyticsService extends BaseService {
  constructor() {
    super(analyticsRepository);
  }

  async getDashboardStats() {
    const totalRevenue = await this.repository.getTotalRevenue();
    const totalBilledHours = await this.repository.getTotalBilledHours();
    const totalUnbilledHours = await this.repository.getTotalUnbilledHours();
    const projectStatsRaw = await this.repository.getProjectStats();
    const clientProfitability = await this.repository.getClientProfitability();

    const projectsByStatus = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0,
      total: 0,
    };

    projectStatsRaw.forEach((stat) => {
      const count = parseInt(stat.count, 10);
      projectsByStatus[stat.status] = count;
      projectsByStatus.total += count;
    });

    const formattedProfitability = clientProfitability.map((client) => ({
      id: client.id,
      name: client.name,
      company: client.company,
      totalInvoiced: parseFloat(client.totalInvoiced),
      totalPaid: parseFloat(client.totalPaid),
    }));

    return {
      revenue: {
        totalEarned: totalRevenue,
      },
      hours: {
        totalBilledHours,
        totalUnbilledHours,
      },
      projects: projectsByStatus,
      clients: formattedProfitability,
    };
  }
}

module.exports = new AnalyticsService();
