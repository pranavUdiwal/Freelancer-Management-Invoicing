const projectService = require('../services/project.service');
const catchAsync = require('../utils/catchAsync');
const BaseController = require('./base.controller');

class ProjectController extends BaseController {
  constructor() {
    super();
    this.service = projectService;
  }

  createProject = catchAsync(async (req, res) => {
    const project = await this.service.create(req.body);
    return this.sendCreated(res, { project });
  });

  getAllProjects = catchAsync(async (req, res) => {
    const projects = await this.service.getAll();
    return this.sendSuccess(res, { projects });
  });

  getProjectById = catchAsync(async (req, res) => {
    const project = await this.service.getById(req.params.id);
    return this.sendSuccess(res, { project });
  });

  updateProject = catchAsync(async (req, res) => {
    const project = await this.service.update(req.params.id, req.body);
    return this.sendSuccess(res, { project });
  });

  deleteProject = catchAsync(async (req, res) => {
    await this.service.delete(req.params.id);
    return this.sendNoContent(res);
  });
}

module.exports = new ProjectController();
