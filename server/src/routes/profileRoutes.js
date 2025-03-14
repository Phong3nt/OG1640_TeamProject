const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middlewares/auth');
const multer = require('multer');

// Cấu hình multer để upload ảnh đại diện
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Route lấy thông tin hồ sơ cá nhân
router.get('/', auth, profileController.getProfile);

// Route cập nhật thông tin hồ sơ cá nhân
router.put('/', auth, upload.single('avatar'), profileController.updateProfile);

module.exports = router;
