const Meeting = require("../models/Meeting");
const { v4: uuidv4 } = require("uuid"); // Install uuid library for generating unique room names
const mongoose = require("mongoose");

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
    res.status(500).json({ message: "Server error" });
  }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    let meetings;

    if (req.user.role === "tutor") {
      // Fetch meetings where the user is the host
      meetings = await Meeting.find({ host: req.user.id }).populate(
        "host participants"
      );
    } else if (req.user.role === "student") {
      // Fetch meetings where the user is a participant
      meetings = await Meeting.find({ participants: req.user.id }).populate(
        "host participants"
      );
    } else if (req.user.role === "staff") {
      // Fetch all meetings for staff
      meetings = await Meeting.find().populate("host participants");
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (!meetings.length) {
      return res.status(404).json({ message: "No meetings found" });
    }

    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Get All Meetings Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.meetingId)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    // Populate participants to include their email addresses
    const meeting = await Meeting.findById(req.params.meetingId).populate(
      "participants", // Assuming "participants" is a reference to the User model
      "fullName" // Only fetch the name field
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    console.error("Get Meeting Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.meetingId);

    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ success: true, message: "Meeting deleted" });
  } catch (error) {
    console.error("Delete Meeting Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
