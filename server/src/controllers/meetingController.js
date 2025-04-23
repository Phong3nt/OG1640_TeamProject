const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid'); // Install uuid library for generating unique room names

// Schedule a new meeting
exports.scheduleMeeting = async (req, res) => {
  try {

    const { title, description, participants, date, duration } = req.body;
    const meetingRoom = `jitsi-${uuidv4()}`;

    const meeting = new Meeting({
      title,
      description,
      host: req.user.id,
      participants,
      meetingRoom,
      date,
      duration,
    });

    await meeting.save();
    res.status(201).json({ success: true, meeting });
  } catch (error) {
    console.error("Schedule Meeting Error:", error.message); 
    res.status(500).json({ message: 'Server error' });
  }
};

// module.exports = {
//   scheduleMeeting,
// };