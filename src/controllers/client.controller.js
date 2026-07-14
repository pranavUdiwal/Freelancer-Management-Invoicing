const clientService = require('../services/client.service');
const catchAsync = require('../utils/catchAsync');

const createClient = catchAsync(async (req, res) => {
  const client = await clientService.createClient(req.body);
  res.status(201).json({
    status: 'success',
    data: { client },
  });
});

const getAllClients = catchAsync(async (req, res) => {
  const clients = await clientService.getAllClients();
  res.status(200).json({
    status: 'success',
    data: { clients },
  });
});

const getClientById = catchAsync(async (req, res) => {
  const client = await clientService.getClientById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { client },
  });
});

const updateClient = catchAsync(async (req, res) => {
  const client = await clientService.updateClient(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { client },
  });
});

const deleteClient = catchAsync(async (req, res) => {
  await clientService.deleteClient(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
