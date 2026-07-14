const invoiceService = require('../services/invoice.service');
const catchAsync = require('../utils/catchAsync');

const generateInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.generateInvoice(req.body);
  res.status(201).json({
    status: 'success',
    data: { invoice },
  });
});

const getAllInvoices = catchAsync(async (req, res) => {
  const invoices = await invoiceService.getAllInvoices();
  res.status(200).json({
    status: 'success',
    data: { invoices },
  });
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id, req.user);
  res.status(200).json({
    status: 'success',
    data: { invoice },
  });
});

const updateInvoiceStatus = catchAsync(async (req, res) => {
  const invoice = await invoiceService.updateInvoiceStatus(req.params.id, req.body.status);
  res.status(200).json({
    status: 'success',
    data: { invoice },
  });
});

const detectOverdue = catchAsync(async (req, res) => {
  const result = await invoiceService.detectOverdue();
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  generateInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  detectOverdue,
};
