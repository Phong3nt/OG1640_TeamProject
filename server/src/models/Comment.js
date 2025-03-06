const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, index: true }, // Hỗ trợ reply comment
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Thêm like cho comment
    repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null } // Reply tới comment khác
  }, { timestamps: true });
  
  module.exports = mongoose.model('Comment', commentSchema);
  