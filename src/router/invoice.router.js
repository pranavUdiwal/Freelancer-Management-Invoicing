const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const {
  validateGenerateInvoice,
  validateUpdateInvoiceStatus,
  validateInvoiceIdParam,
} = require('../middlewares/validators/invoice.validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin', 'manager'), validateGenerateInvoice, invoiceController.generateInvoice)
  .get(restrictTo('admin', 'manager'), invoiceController.getAllInvoices);

router.post('/detect-overdue', restrictTo('admin', 'manager'), invoiceController.detectOverdue);

router
  .route('/:id')
  .get(validateInvoiceIdParam, invoiceController.getInvoiceById);

router
  .route('/:id/status')
  .patch(restrictTo('admin', 'manager'), validateUpdateInvoiceStatus, invoiceController.updateInvoiceStatus);

module.exports = router;
