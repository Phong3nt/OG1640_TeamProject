const express = require('express');
const allocationController = require('../controllers/tutorAllocationController'); 
const { requireSignIn } = require('../middlewares/auth'); 


const restrictTo = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }
    next();
  };
};

const router = express.Router();
router.use(requireSignIn, restrictTo('staff'));
router.post('/', allocationController.createAllocation);
router.get('/', allocationController.getAllocations);
router.put('/:id/deactivate', allocationController.deactivateAllocation);


module.exports = router;