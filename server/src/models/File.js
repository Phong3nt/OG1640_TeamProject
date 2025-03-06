const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Người upload
  filename: { type: String, required: true, trim: true }, // Tên file
  url: { type: String, required: true, trim: true }, // Đường dẫn file
  size: { type: Number, default: 0 }, // Kích thước file (KB, MB)
  fileType: {
    type: String,
    enum: ['image', 'document', 'video', 'audio', 'other'],
    required: true
  }, // Loại file
  mimetype: { type: String, trim: true }, // Kiểu file (application/pdf, image/png...)
  description: { type: String, trim: true }, // Mô tả file
  isDeleted: { type: Boolean, default: false } // Soft delete
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
