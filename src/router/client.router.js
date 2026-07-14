const express = require('express');
const clientController = require('../controllers/client.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const {
  validateCreateClient,
  validateUpdateClient,
  validateClientIdParam,
} = require('../middlewares/validators/client.validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin', 'manager'), validateCreateClient, clientController.createClient)
  .get(clientController.getAllClients);

router
  .route('/:id')
  .get(validateClientIdParam, clientController.getClientById)
  .patch(restrictTo('admin', 'manager'), validateUpdateClient, clientController.updateClient)
  .delete(restrictTo('admin', 'manager'), validateClientIdParam, clientController.deleteClient);

module.exports = router;
