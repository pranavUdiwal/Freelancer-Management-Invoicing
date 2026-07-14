const clientRepository = require('../repositories/client.repository');
const AppError = require('../utils/AppError');

class ClientService {
  async createClient(data) {
    const existingClient = await clientRepository.findByEmail(data.email);
    if (existingClient) {
      throw new AppError('Email is already in use by another client', 400);
    }
    return await clientRepository.create(data);
  }

  async getAllClients() {
    return await clientRepository.findAll();
  }

  async getClientById(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return client;
  }

  async updateClient(id, data) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }

    if (data.email) {
      const existingClient = await clientRepository.findByEmail(data.email);
      if (existingClient && existingClient.id !== id) {
        throw new AppError('Email is already in use by another client', 400);
      }
    }

    return await clientRepository.update(id, data);
  }

  async deleteClient(id) {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    await clientRepository.delete(id);
  }
}

module.exports = new ClientService();
