const express = require('express');
const commentController = require('../controllers/commentController');
const { requireSignIn } = require('../middlewares/auth');

const router = express.Router();

router.use(requireSignIn);

// router.get('/blogs/:blogId/comments', commentController.getCommentsByBlog);
router.get('/:commentId/replies', commentController.getRepliesByComment);
router.post('/blogs/:blogId/comments', commentController.createComment); 
router.delete('/:commentId', requireSignIn, commentController.deleteComment);
router.post('/:commentId/like', commentController.likeComment); 
router.delete('/:commentId/like', commentController.unlikeComment); 

module.exports = router;