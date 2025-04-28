const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { requireSignIn } = require('../middlewares/auth');     

const restrictTo = (...roles) => {
  return (req, res, next) => {
    
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }
    next();
  };
};



router.get(
    '/dashboard',
    requireSignIn,                     
    restrictTo('staff', 'admin'),      
    statsController.getDashboardStats  
);


module.exports = router;