const analyticsRepository = require('../repositories/analytics.repository');

class AnalyticsService {
  async getDashboardStats() {
    const totalRevenue = await analyticsRepository.getTotalRevenue();
    const totalBilledHours = await analyticsRepository.getTotalBilledHours();
    const totalUnbilledHours = await analyticsRepository.getTotalUnbilledHours();
    const projectStatsRaw = await analyticsRepository.getProjectStats();
    const clientProfitability = await analyticsRepository.getClientProfitability();

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
