const mongoose = require('mongoose');

// models/Post.js
const postSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    title: { type: String, required: true, trim: true }, // Thêm tiêu đề post
    content: { type: String, required: true, trim: true },
    image: { type: String, default: null }, // Thêm ảnh minh họa cho bài viết
    tags: [{ type: String, trim: true }], // Thêm tags
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách user đã like
    isPublished: { type: Boolean, default: false }, // Trạng thái post
  }, { timestamps: true });
  
  module.exports = mongoose.model('Post', postSchema);
  