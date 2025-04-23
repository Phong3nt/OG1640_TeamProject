const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true }, // ID of the meeting
  fileName: { type: String, required: true }, // Name of the recording file
  fileType: { type: String, required: true }, // File type (e.g., mp4, m4a)
  fileUrl: { type: String, required: true }, // URL to access the recording
  fileSize: { type: Number, required: true }, // File size in bytes
  createdAt: { type: Date, default: Date.now }, // Timestamp of when the recording was saved
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;