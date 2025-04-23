const Blog = require('../models/Blog');

const createBlog = async (data) => {
  const blog = new Blog(data);
  await blog.save();
  return blog;
};

// Lấy tất cả blog
const getBlogs = async () => {
  return await Blog.find().populate('author', 'fullName');
};

// Lấy blog theo ID
const getBlogById = async (id) => {
  return await Blog.findById(id).populate('author', 'fullName');
};

const updateBlog = async (id, data) => {
  return await Blog.findByIdAndUpdate(id, data, { new: true });
};

const deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};



// const Blog = require('../models/Blog');

// exports.getBlogs = async ({ category, keyword, page, limit }) => {
//     const filter = {};
//     if (category) filter.category = category;
//     if (keyword) filter.title = new RegExp(keyword, 'i');
//     return await Blog.find(filter).skip((page - 1) * limit).limit(parseInt(limit));
// };

// exports.getBlogById = async (id) => await Blog.findById(id);

// exports.createBlog = async (userId, data) => await Blog.create({ ...data, author: userId });

// exports.updateBlog = async (id, userId, data) => {
//     const blog = await Blog.findById(id);
//     if (!blog || (blog.author.toString() !== userId)) return null;
//     return await Blog.findByIdAndUpdate(id, data, { new: true });
// };

// exports.deleteBlog = async (id, userId) => {
//     const blog = await Blog.findById(id);
//     if (!blog || (blog.author.toString() !== userId)) return null;
//     await Blog.findByIdAndDelete(id);
//     return true;
// };