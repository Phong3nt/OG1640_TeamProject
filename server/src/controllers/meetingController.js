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

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ host: req.user.id }).populate('host participants');
    
    if (!meetings.length) {
      return res.status(404).json({ message: 'No meetings found' });
    }

    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Get All Meetings Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('host participants');
    
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    console.error("Get Meeting Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a meeting
exports.updateMeeting = async (req, res) => {
  try {
    const { title, description, participants, date, duration } = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { title, description, participants, date, duration },
      { new: true }
    ).populate('host participants');

    if (!updatedMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json({ success: true, meeting: updatedMeeting });
  } catch (error) {
    console.error("Update Meeting Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!deletedMeeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.status(200).json({ success: true, message: 'Meeting deleted' });
  } catch (error) {
    console.error("Delete Meeting Error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
