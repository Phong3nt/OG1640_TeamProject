const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.post('/blogs', blogController.createBlog);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;