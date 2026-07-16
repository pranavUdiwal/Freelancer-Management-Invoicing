const invoiceService = require('../services/invoice.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class InvoiceController extends BaseController {
  constructor() {
    super();
    this.service = invoiceService;
  }

  generateInvoice = catchAsync(async (req, res) => {
    const invoice = await this.service.generateInvoice(req.body);
    return this.sendCreated(res, { invoice });
  });

  getAllInvoices = catchAsync(async (req, res) => {
    const invoices = await this.service.getAllInvoices();
    return this.sendSuccess(res, { invoices });
  });

  getInvoiceById = catchAsync(async (req, res) => {
    const invoice = await this.service.getInvoiceById(req.params.id, req.user);
    return this.sendSuccess(res, { invoice });
  });

  updateInvoiceStatus = catchAsync(async (req, res) => {
    const invoice = await this.service.updateInvoiceStatus(req.params.id, req.body.status);
    return this.sendSuccess(res, { invoice });
  });

  detectOverdue = catchAsync(async (req, res) => {
    const result = await this.service.detectOverdue();
    return this.sendSuccess(res, result);
  });
}

module.exports = new InvoiceController();
