const express = require("express");
const multer = require("multer");
const { requireSignIn } = require("../middlewares/auth");
const profileController = require("../controllers/profileController");

const router = express.Router();

// Cấu hình multer để lưu ảnh đại diện
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Lấy thông tin người dùng hiện tại
router.get("/profile/me", requireSignIn, profileController.getProfile);

// Cập nhật thông tin người dùng hiện tại + ảnh đại diện
router.put("/profile/me", requireSignIn, upload.single("avatar"), profileController.updateProfile);

module.exports = router;