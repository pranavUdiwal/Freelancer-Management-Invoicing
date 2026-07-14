const projectRepository = require('../repositories/project.repository');
const clientRepository = require('../repositories/client.repository');
const AppError = require('../utils/AppError');

class ProjectService {
  async createProject(data) {
    const client = await clientRepository.findById(data.clientId);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return await projectRepository.create(data);
  }

  async getAllProjects() {
    return await projectRepository.findAll();
  }

  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  }

  async updateProject(id, data) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (data.clientId) {
      const client = await clientRepository.findById(data.clientId);
      if (!client) {
        throw new AppError('Client not found', 404);
      }
    }

    return await projectRepository.update(id, data);
  }

  async deleteProject(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    await projectRepository.delete(id);
  }
}

module.exports = new ProjectService();
