const clientService = require('../services/client.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class ClientController extends BaseController {
  constructor() {
    super();
    this.service = clientService;
  }

  createClient = catchAsync(async (req, res) => {
    const client = await this.service.create(req.body);
    return this.sendCreated(res, { client });
  });

  getAllClients = catchAsync(async (req, res) => {
    const clients = await this.service.getAll();
    return this.sendSuccess(res, { clients });
  });

  getClientById = catchAsync(async (req, res) => {
    const client = await this.service.getById(req.params.id);
    return this.sendSuccess(res, { client });
  });

  updateClient = catchAsync(async (req, res) => {
    const client = await this.service.update(req.params.id, req.body);
    return this.sendSuccess(res, { client });
  });

  deleteClient = catchAsync(async (req, res) => {
    await this.service.delete(req.params.id);
    return this.sendNoContent(res);
  });
}

module.exports = new ClientController();
