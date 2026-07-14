const { Invoice, Project, Client, sequelize } = require('../models');
const { Op } = require('sequelize');

class InvoiceRepository {
  async create(data, options = {}) {
    return await Invoice.create(data, options);
  }

  async findAll(where = {}) {
    return await Invoice.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
      ],
    });
  }

  async findById(id) {
    return await Invoice.findByPk(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
      ],
    });
  }

  async update(id, data, options = {}) {
    const [, [updatedInvoice]] = await Invoice.update(data, {
      where: { id },
      returning: true,
      ...options,
    });
    return updatedInvoice;
  }

  async countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await Invoice.count({
      where: {
        createdAt: {
          [Op.gte]: startOfDay,
        },
      },
    });
  }
}

module.exports = new InvoiceRepository();
