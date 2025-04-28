const express = require('express');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');

const router = express.Router();
const { requireSignIn } = require('../middlewares/auth');

router.post('/blogs', requireSignIn, blogController.createBlog);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.delete('/blogs/:id', requireSignIn, blogController.deleteBlog);
router.put('/blogs/:id', requireSignIn, blogController.updateBlog);
router.get('/blogs/:blogId/comments', commentController.getCommentsByBlog); // <-- Phải có '/blogs/' ở đầu
router.post('/blogs/:blogId/comments', requireSignIn, commentController.createComment); // <-- Phải có '/blogs/' ở đầu


module.exports = router;
