const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Tin nhắn mới nhất
  isDeleted: { type: Boolean, default: false } // Soft delete
}, { timestamps: true });
conversationSchema.index({ participants: 1 });
module.exports = mongoose.model('Conversation', conversationSchema);
