const { Project, Client } = require('../models');

class ProjectRepository {
  async create(data) {
    return await Project.create(data);
  }

  async findAll() {
    return await Project.findAll({
      include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'company'] }],
    });
  }

  async findById(id) {
    return await Project.findByPk(id, {
      include: [{ model: Client, as: 'client', attributes: ['id', 'name', 'company'] }],
    });
  }

  async update(id, data) {
    const [, [updatedProject]] = await Project.update(data, {
      where: { id },
      returning: true,
    });
    return updatedProject;
  }

  async delete(id) {
    return await Project.destroy({ where: { id } });
  }
}

module.exports = new ProjectRepository();
