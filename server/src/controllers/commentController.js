
const Comment = require('../models/Comment');
const Blog = require('../models/Blog'); 
const mongoose = require('mongoose');

async function findComment(commentId, res) {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'ID bình luận không hợp lệ.' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        res.status(404).json({ message: 'Không tìm thấy bình luận.' });
        return null;
    }
    return comment;
}


/**
 * @description Thêm bình luận mới vào một blog (hoặc trả lời bình luận khác)
 * @route POST /api/blogs/:blogId/comments  <-- Sửa route
 * @access Private
 */
exports.createComment = async (req, res) => {
    const { content, parentCommentId } = req.body;
    const { blogId } = req.params;
    const commenterId = req.user?.id;

    if (!commenterId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Nội dung bình luận không được để trống.' });
    }
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'ID blog không hợp lệ.' }); 
    }

    try {
        const blogExists = await Blog.findById(blogId); 
        if (!blogExists) {
            return res.status(404).json({ message: 'Không tìm thấy blog.' }); 
        }

        let parentComment = null;
        if (parentCommentId) {
            if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
                return res.status(400).json({ message: 'ID bình luận cha không hợp lệ.' });
            }
            parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Không tìm thấy bình luận cha để trả lời.' });
            }
            if (!parentComment.blog || parentComment.blog.toString() !== blogId) { // Kiểm tra trường 'blog'
                 return res.status(400).json({ message: 'Không thể trả lời bình luận không thuộc blog này.' }); // Sửa thông báo
            }
        }

        const newComment = new Comment({
            content: content.trim(),
            blog: blogId, 
            commenter: commenterId,
            parentComment: parentComment ? parentComment._id : null,
        });

        const savedComment = await newComment.save();
        const populatedComment = await savedComment.populate('commenter', 'fullName'); // Giả sử User model có username, avatar

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Lỗi tạo bình luận:", error);
        // Cung cấp thêm chi tiết lỗi trong môi trường dev nếu cần
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi tạo bình luận.';
        res.status(500).json({ message: errorMessage });
    }
};

/**
 * @description Lấy danh sách bình luận gốc cho một blog (có phân trang)
 * @route GET /api/blogs/:blogId/comments  <-- Sửa route
 * @access Public
 */
exports.getCommentsByBlog = async (req, res) => {
    const { blogId } = req.params; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'ID blog không hợp lệ.' }); // Sửa thông báo
    }

    try {
        const comments = await Comment.find({ blog: blogId, parentComment: null }) // Sử dụng trường 'blog'
            .populate('commenter', 'fullName username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalComments = await Comment.countDocuments({ blog: blogId, parentComment: null }); // Sử dụng trường 'blog'
        const totalPages = Math.ceil(totalComments / limit);

        res.status(200).json({
            comments,
            currentPage: page,
            totalPages,
            totalComments,
        });
    } catch (error) {
        console.error("Lỗi lấy bình luận:", error);
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi lấy bình luận.';
        res.status(500).json({ message: errorMessage });
    }
};

/**
 * @description Lấy danh sách các trả lời cho một bình luận (có phân trang)
 * @route GET /api/comments/:commentId/replies
 * @access Public
 */
exports.getRepliesByComment = async (req, res) => {
    const { commentId } = req.params; // ID của comment cha
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

     if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'ID bình luận cha không hợp lệ.' });
    }

    try {
        // Kiểm tra comment cha tồn tại (không bắt buộc nhưng nên có)
        const parentExists = await Comment.findById(commentId);
        if (!parentExists) {
             return res.status(404).json({ message: 'Không tìm thấy bình luận cha.' });
        }

        // Tìm các comment có parentComment là commentId này
        const replies = await Comment.find({ parentComment: commentId })
            .populate('commenter', 'fullName username avatar')
            .sort({ createdAt: 1 }) // Thường sắp xếp replies từ cũ -> mới
            .skip(skip)
            .limit(limit);

        const totalReplies = await Comment.countDocuments({ parentComment: commentId });
        const totalPages = Math.ceil(totalReplies / limit);

        res.status(200).json({
            replies,
            currentPage: page,
            totalPages,
            totalReplies,
        });
    } catch (error) {
        console.error("Lỗi lấy replies:", error);
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi lấy replies.';
        res.status(500).json({ message: errorMessage });
    }
};


/**
 * @description Thích một bình luận
 * @route POST /api/comments/:commentId/like
 * @access Private
 */
exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }

    try {
        // findComment đã kiểm tra commentId hợp lệ và comment tồn tại
        const comment = await findComment(commentId, res);
        if (!comment) return; // findComment đã gửi lỗi nếu không tìm thấy

        // Thêm userId vào mảng likes nếu chưa tồn tại
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } }, // $addToSet ngăn trùng lặp
            { new: true } // Trả về document sau khi cập nhật
        ).populate('commenter', 'fullName username avatar'); // Populate lại để có thông tin mới nhất (nếu cần)

        // Kiểm tra lại phòng trường hợp comment bị xóa ngay sau findComment
        if (!updatedComment) {
             return res.status(404).json({ message: 'Không tìm thấy bình luận sau khi thử cập nhật.' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Lỗi like bình luận:", error);
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi thích bình luận.';
        res.status(500).json({ message: errorMessage });
    }
};

/**
 * @description Bỏ thích một bình luận
 * @route DELETE /api/comments/:commentId/like
 * @access Private
 */
exports.unlikeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }

     try {
        const comment = await findComment(commentId, res);
        if (!comment) return;

        // Xóa userId khỏi mảng likes
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likes: userId } }, // $pull xóa tất cả các instance của userId
            { new: true }
        ).populate('commenter', 'fullName username avatar');

         if (!updatedComment) {
             return res.status(404).json({ message: 'Không tìm thấy bình luận sau khi thử cập nhật.' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Lỗi unlike bình luận:", error);
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi bỏ thích bình luận.';
        res.status(500).json({ message: errorMessage });
    }
};

/**
 * @description Xóa một bình luận (và các trả lời của nó)
 * @route DELETE /api/comments/:commentId
 * @access Private (Chủ comment hoặc staff)
 */
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?.id;
    // const userRole = req.user?.role; // Có thể cần kiểm tra vai trò staff

    if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực.' });
    }

    try {
        const comment = await findComment(commentId, res);
        if (!comment) return;

        // Kiểm tra quyền: Chỉ người tạo comment mới được xóa
        // (Hoặc thêm logic kiểm tra staff: && userRole !== 'staff')
        if (comment.commenter.toString() !== userId ) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này.' });
        }

        // Xóa tất cả các comment con (replies) trước
        await Comment.deleteMany({ parentComment: comment._id });

        // Sau đó xóa comment cha
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: 'Bình luận và các trả lời đã được xóa thành công.' });

    } catch (error) {
        console.error("Lỗi xóa bình luận:", error);
        const errorMessage = process.env.NODE_ENV === 'development' ? error.message : 'Lỗi server khi xóa bình luận.';
        res.status(500).json({ message: errorMessage });
    }
};

// Nếu bạn có hàm updateComment, cũng cần đảm bảo nó kiểm tra quyền và cập nhật đúng cách
// exports.updateComment = async (req, res) => { ... };