// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

// Route lấy thông tin dashboard (bắt buộc đăng nhập)
router.get('/', auth, dashboardController.getDashboardData);

module.exports = router;
