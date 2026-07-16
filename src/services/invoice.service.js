const invoiceRepository = require('../repositories/invoice.repository');
const projectRepository = require('../repositories/project.repository');
const timeLogRepository = require('../repositories/timeLog.repository');
const { TimeLog, Task, Invoice, sequelize } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');
const BaseService = require('./base.service');

class InvoiceService extends BaseService {
  constructor() {
    super(invoiceRepository);
  }

  async generateInvoice(data) {
    const project = await projectRepository.findById(data.projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const transaction = await sequelize.transaction();
    try {
      const logs = await TimeLog.findAll({
        include: [{
          model: Task,
          as: 'task',
          where: { projectId: data.projectId },
          attributes: [],
        }],
        where: { isBilled: false },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (logs.length === 0) {
        throw new AppError('No unbilled hours found for this project', 400);
      }

      let totalHours = 0;
      for (const log of logs) {
        totalHours += parseFloat(log.hours);
      }

      const totalAmount = totalHours * parseFloat(data.hourlyRate);
      const taxRate = parseFloat(data.taxRate || 0);
      const taxAmount = totalAmount * (taxRate / 100);
      const finalAmount = totalAmount + taxAmount;

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const date = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${date}`;

      const todayCount = await this.repository.countToday();
      const counter = String(todayCount + 1).padStart(4, '0');
      const invoiceNumber = `INV-${dateStr}-${counter}`;

      const invoice = await super.create({
        invoiceNumber,
        projectId: data.projectId,
        clientId: project.clientId,
        totalHours,
        hourlyRate: data.hourlyRate,
        totalAmount,
        taxRate,
        taxAmount,
        finalAmount,
        status: 'draft',
        issuedDate: new Date(),
        dueDate: data.dueDate,
        notes: data.notes,
      }, { transaction });

      for (const log of logs) {
        await timeLogRepository.update(log.id, {
          isBilled: true,
          invoiceId: invoice.id,
        }, { transaction });
      }

      await transaction.commit();
      return await super.getById(invoice.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getInvoiceById(id, currentUser) {
    const invoice = await super.getById(id);

    if (currentUser.role === 'freelancer') {
      const logs = await TimeLog.findAll({
        where: { invoiceId: invoice.id, userId: currentUser.id },
      });
      if (logs.length === 0) {
        throw new AppError('You do not have permission to view this invoice', 403);
      }
    }

    return invoice;
  }

  async updateInvoiceStatus(id, status) {
    const invoice = await super.getById(id);

    const transaction = await sequelize.transaction();
    try {
      const updateData = { status };

      if (status === 'paid') {
        updateData.paidAt = new Date();
      } else if (status === 'cancelled') {
        await TimeLog.update({
          isBilled: false,
          invoiceId: null,
        }, {
          where: { invoiceId: id },
          transaction,
        });
      }

      await this.repository.update(id, updateData, { transaction });
      await transaction.commit();

      return await super.getById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async detectOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [affectedCount] = await Invoice.update(
      { status: 'overdue' },
      {
        where: {
          status: 'sent',
          dueDate: {
            [Op.lt]: today,
          },
        },
      }
    );
    return { affectedCount };
  }
}

module.exports = new InvoiceService();
