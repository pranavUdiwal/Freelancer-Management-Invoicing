const { Invoice, Project, Client, sequelize } = require('../models');
const BaseRepository = require('./base.repository');
const { Op } = require('sequelize');

class InvoiceRepository extends BaseRepository {
  constructor() {
    super(Invoice);
  }

  async findAll(options = {}) {
    return super.findAll({
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
      ],
      ...options,
    });
  }

  async findById(id, options = {}) {
    return super.findById(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
      ],
      ...options,
    });
  }

  async countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await this.model.count({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });
  }
}

module.exports = new InvoiceRepository();
