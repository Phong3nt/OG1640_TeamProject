const blogService = require('../services/blogService');
const User = require('../models/User');
const Blog = require("../models/Blog")


const createBlog = async (req, res) => {
  try {
    const { title, description, coverImage } = req.body;

    const authorId = req.user?.id; // Lấy ID từ user đã xác thực qua token

    if (!authorId) {
        console.error("Lỗi nghiêm trọng: req.user.id không tồn tại trong createBlog dù đã qua requireSignIn.");
        return res.status(401).json({ message: "Không thể xác định tác giả bài viết." });
    }

     if (!title || !description || !coverImage) {
         return res.status(400).json({ message: "Vui lòng cung cấp đủ Title, Description và Cover Image (public_id)." });
     }

    const blogData = {
      title,
      description,
      coverImage, // Đây là public_id từ Cloudinary
      author: authorId // <-- Sử dụng ID lấy từ token
    };

    console.log('Data being passed to blogService.createBlog:', blogData);

    const blog = await blogService.createBlog(blogData);

     const populatedBlog = await Blog.findById(blog._id)
                                     .populate('author', 'fullName email'); // Lấy các trường cần thiết

    res.status(201).json(populatedBlog || blog); // Trả về blog đã populate nếu thành công

  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: error.message || "Lỗi server khi tạo bài viết." });
  }
};
// Lấy tất cả blog
const getBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getBlogs(); // Sử dụng blogService
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy blog theo ID
const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id); // Sử dụng blogService

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }    if (userRole !== 'staff') {
       return res.status(403).json({ message: 'Chỉ Staff mới có quyền thực hiện hành động này.' });
    }
    const updatedBlog = await blogService.updateBlog(blogId, req.body);
    if (!updatedBlog) {
         return res.status(404).json({ message: 'Blog not found during update process.' });
    }

    res.status(200).json(updatedBlog);

  } catch (error) {
    console.error("Lỗi cập nhật blog (staff):", error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật blog.', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

     if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }
    if (userRole !== 'staff') {
       return res.status(403).json({ message: 'Chỉ Staff mới có quyền thực hiện hành động này.' });
    }

    const deletedBlog = await blogService.deleteBlog(blogId);
    if (!deletedBlog) {
         return res.status(404).json({ message: 'Blog not found during delete process.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });

  } catch (error) {
    console.error("Lỗi xóa blog (staff):", error);
    res.status(500).json({ message: 'Lỗi server khi xóa blog.', error: error.message });
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