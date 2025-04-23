const express = require('express');
const { scheduleMeeting } = require('../controllers/meetingController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Route to schedule a new meeting
router.post('/', auth, scheduleMeeting);

module.exports = router;