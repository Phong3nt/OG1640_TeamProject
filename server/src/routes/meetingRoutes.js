const express = require('express');
const { 
  scheduleMeeting, 
  getAllMeetings, 
  getMeetingById, 
  deleteMeeting 
} = require('../controllers/meetingController');
const { requireSignIn } = require('../middlewares/auth');

const router = express.Router();

// Route to schedule a new meeting
router.post('/', requireSignIn, scheduleMeeting);

// Route to get all meetings for the signed-in user
router.get('/', requireSignIn, getAllMeetings);

// Route to get a specific meeting by ID
router.get('/:meetingId', requireSignIn, getMeetingById);

// Route to delete a meeting by ID
router.delete('/:meetingId', requireSignIn, deleteMeeting);

module.exports = router;
