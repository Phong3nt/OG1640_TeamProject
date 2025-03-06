const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // Tiêu đề buổi họp
  description: { type: String, trim: true }, // Mô tả nội dung
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tạo cuộc họp
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách người tham gia
  meetingLink: { type: String, trim: true }, // Link họp online
  date: { type: Date, required: true, index: true}, // Thời gian họp
  duration: { type: Number, default: 60 }, // Thời lượng họp (phút)
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }, // Trạng thái buổi họp
  isRecorded: { type: Boolean, default: false }, // Đã ghi hình hay chưa
  recording: { type: mongoose.Schema.Types.ObjectId, ref: 'Recording', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
