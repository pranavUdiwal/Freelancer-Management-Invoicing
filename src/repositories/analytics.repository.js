const { Invoice, TimeLog, Project, Client, sequelize } = require('../models');
const BaseRepository = require('./base.repository');
const { Op } = require('sequelize');

class AnalyticsRepository extends BaseRepository {
  constructor() {
    super(null);
  }

  async getTotalRevenue() {
    const sum = await Invoice.sum('finalAmount', { where: { status: 'paid' } });
    return parseFloat(sum || 0);
  }

  async getTotalBilledHours() {
    const sum = await Invoice.sum('totalHours', {
      where: { status: { [Op.in]: ['paid', 'sent'] } },
    });
    return parseFloat(sum || 0);
  }

  async getTotalUnbilledHours() {
    const sum = await TimeLog.sum('hours', { where: { isBilled: false } });
    return parseFloat(sum || 0);
  }

  async getProjectStats() {
    const stats = await Project.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    return stats;
  }

  async getClientProfitability() {
    return await Client.findAll({
      attributes: [
        'id',
        'name',
        'company',
        [
          sequelize.fn(
            'COALESCE',
            sequelize.fn('SUM', sequelize.col('invoices.final_amount')),
            0
          ),
          'totalInvoiced',
        ],
        [
          sequelize.fn(
            'COALESCE',
            sequelize.fn(
              'SUM',
              sequelize.literal(
                "CASE WHEN invoices.status = 'paid' THEN invoices.final_amount ELSE 0 END"
              )
            ),
            0
          ),
          'totalPaid',
        ],
      ],
      include: [
        {
          model: Invoice,
          as: 'invoices',
          attributes: [],
        },
      ],
      group: ['Client.id'],
      raw: true,
    });
  }
}

module.exports = new AnalyticsRepository();
