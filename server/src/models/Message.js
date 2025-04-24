const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
  conversationId: { type: Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender:         { type: Types.ObjectId, ref: 'User', required: true, index: true },
  content:        { type: String, trim: true, default: '' },
  type:           { type: String, enum: ['text','file','image','video','audio'], default: 'text' },
  status:         { type: String, enum: ['sent','delivered','read'], default: 'sent', index: true },
  readBy:         { type: [Types.ObjectId], default: [] },   // A,B – nhanh gọn
  deletedBy:      { type: [Types.ObjectId], default: [] },   // soft delete per user
  repliedTo:      { type: Types.ObjectId, ref: 'Message', default: null }
}, { timestamps: true });

module.exports = model('Message', messageSchema);
