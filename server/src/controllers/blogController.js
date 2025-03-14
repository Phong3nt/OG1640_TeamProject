const blogService = require('../services/blogService');
const User = require('../models/User');

const createBlog = async (req, res) => {
  try {
    // Find the user by name (or any other unique identifier)
    const user = await User.findOne({ fullName: req.body.author });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the blog with the user's ObjectId as the author
    const blogData = {
      ...req.body,
      author: user._id,
    };
    const blog = await blogService.createBlog(blogData);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};


// const Blog = require('../models/Blog');
// const blogService = require('../services/blogService');

// // Lấy danh sách blog với phân trang và tìm kiếm
// exports.getBlogs = async (req, res) => {
//     try {
//         const { category, keyword, page = 1, limit = 10 } = req.query;
//         const blogs = await blogService.getBlogs({ category, keyword, page, limit });
//         res.status(200).json(blogs);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách blog', error });
//     }
// };

// // Lấy chi tiết blog
// exports.getBlogById = async (req, res) => {
//     try {
//         const blog = await blogService.getBlogById(req.params.id);
//         if (!blog) return res.status(404).json({ message: 'Blog không tồn tại' });
//         res.status(200).json(blog);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy blog', error });
//     }
// };

// // Tạo blog mới
// exports.createBlog = async (req, res) => {
//     try {
//         const newBlog = await blogService.createBlog(req.user.id, req.body);
//         res.status(201).json(newBlog);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi tạo blog', error });
//     }
// };

// // Cập nhật blog
// exports.updateBlog = async (req, res) => {
//     try {
//         const updatedBlog = await blogService.updateBlog(req.params.id, req.user.id, req.body);
//         if (!updatedBlog) return res.status(403).json({ message: 'Không có quyền chỉnh sửa blog này' });
//         res.status(200).json(updatedBlog);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi cập nhật blog', error });
//     }
// };

// // Xóa blog
// exports.deleteBlog = async (req, res) => {
//     try {
//         const deleted = await blogService.deleteBlog(req.params.id, req.user.id);
//         if (!deleted) return res.status(403).json({ message: 'Không có quyền xóa blog này' });
//         res.status(200).json({ message: 'Đã xóa blog' });
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi xóa blog', error });
//     }
// };