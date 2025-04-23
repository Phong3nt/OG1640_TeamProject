const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();


router.post('/blogs', blogController.createBlog);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const blogController = require('../controllers/blogController');
// const auth = require('../middlewares/auth');

// router.get('/', blogController.getBlogs);
// router.get('/:id', blogController.getBlogById);
// router.post('/', auth, blogController.createBlog);
// router.put('/:id', auth, blogController.updateBlog);
// router.delete('/:id', auth, blogController.deleteBlog);

// module.exports = router;