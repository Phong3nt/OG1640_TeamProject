// controllers/dashboardController.js
const dashboardService = require('../services/dashboardService');

// Lấy thông tin tổng quan cho Dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const dashboardData = await dashboardService.getDashboardData();

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};