const express = require('express');
const projectController = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const {
  validateCreateProject,
  validateUpdateProject,
  validateProjectIdParam,
} = require('../middlewares/validators/project.validator');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(restrictTo('admin', 'manager'), validateCreateProject, projectController.createProject)
  .get(projectController.getAllProjects);

router
  .route('/:id')
  .get(validateProjectIdParam, projectController.getProjectById)
  .patch(restrictTo('admin', 'manager'), validateUpdateProject, projectController.updateProject)
  .delete(restrictTo('admin', 'manager'), validateProjectIdParam, projectController.deleteProject);

module.exports = router;
