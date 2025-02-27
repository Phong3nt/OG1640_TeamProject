const mongoose = require('mongoose');

// models/Blog.js
const blogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true }, // Thêm mô tả cho blog
    coverImage: { type: String, default: null }, // Hình ảnh đại diện blog
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isPublished: { type: Boolean, default: false }, // Trạng thái blog
    category: { type: String, trim: true }, // Phân loại blog
  }, { timestamps: true });
  
  module.exports = mongoose.model('Blog', blogSchema);
  