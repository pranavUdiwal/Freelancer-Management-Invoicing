const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin', 'manager'));

router.get('/dashboard', analyticsController.getDashboardStats);

module.exports = router;
