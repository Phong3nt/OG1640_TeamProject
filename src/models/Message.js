const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true }, // Tham chiếu đến cuộc hội thoại
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Người gửi
  content: { type: String, trim: true }, // Nội dung tin nhắn
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'video', 'audio'],
    default: 'text'
  }, // Loại tin nhắn
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
    index: true
  }, // Trạng thái tin nhắn
  isDeleted: { type: Boolean, default: false }, // Soft delete
  repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null } // Reply tới message khác
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);