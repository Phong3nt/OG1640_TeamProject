const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true }, 
  coverImage: { type: String, default: null }, 
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  isPublished: { type: Boolean, default: false }, 
  category: { type: String, trim: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);