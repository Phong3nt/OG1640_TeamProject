const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const conversationSchema = new Schema({
  participants: {
    type: [ { type: Types.ObjectId, ref: 'User', required: true } ],
    validate: v => v.length === 2            // 1‑1 chat cố định 2 người
  },
  deletedBy: { type: [Types.ObjectId], default: [] }, // ẩn với từng cá nhân
  lastMessage: { type: Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

conversationSchema.index({ participants: 1 }, { unique: true }); // combo index 2 ID
module.exports = model('Conversation', conversationSchema);
