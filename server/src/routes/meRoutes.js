const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middlewares/auth'); 
const { getMyAllocations } = require('../controllers/tutorAllocationController');

router.get('/allocations', requireSignIn, getMyAllocations);
module.exports = router;