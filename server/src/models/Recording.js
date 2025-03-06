const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true, index: true }, // Cuộc họp liên quan
  url: { type: String, required: true, trim: true }, // Link file ghi âm
  filename: { type: String, required: true, trim: true }, // Tên file ghi âm
  size: { type: Number, default: 0 }, // Kích thước file (MB)
  format: { type: String, enum: ['mp4', 'mp3', 'wav'], required: true }, // Định dạng file
  duration: { type: Number, default: 0 }, // Thời lượng ghi âm (phút)
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Người thực hiện ghi âm
}, { timestamps: true });

module.exports = mongoose.model('Recording', recordingSchema);
