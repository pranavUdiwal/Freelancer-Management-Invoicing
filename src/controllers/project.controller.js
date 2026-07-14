const projectService = require('../services/project.service');
const catchAsync = require('../utils/catchAsync');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json({
    status: 'success',
    data: { project },
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const projects = await projectService.getAllProjects();
  res.status(200).json({
    status: 'success',
    data: { projects },
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { project },
  });
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: { project },
  });
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
