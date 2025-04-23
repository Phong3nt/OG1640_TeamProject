const Recording = require('../models/Recording');

/**
 * Save recording metadata to the database.
 * @param {String} meetingId - The ID of the meeting.
 * @param {String} fileName - The name of the recording file.
 * @param {String} fileType - The type of the recording file (e.g., mp4, m4a).
 * @param {String} fileUrl - The URL to access the recording.
 * @param {Number} fileSize - The size of the recording file in bytes.
 */
const saveRecordingMetadata = async (meetingId, fileName, fileType, fileUrl, fileSize) => {
  try {
    const recording = new Recording({
      meetingId,
      fileName,
      fileType,
      fileUrl,
      fileSize,
    });

    await recording.save();
    console.log('Recording metadata saved to database:', recording);
    return recording;
  } catch (error) {
    console.error('Error saving recording metadata:', error.message);
    throw error;
  }
};

module.exports = { saveRecordingMetadata };