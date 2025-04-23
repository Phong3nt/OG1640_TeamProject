const express = require("express");
const multer = require("multer");
const { requireSignIn } = require("../middlewares/auth");
const {
  updateProfileController,
  registerController,
  loginController,
  forgotPasswordController,
} = require("../controllers/authController");

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
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.get("/profile/:id", profileController.getProfile);

router.put("/profile/update", requireSignIn, updateProfileController);

//router.put("/me", requireSignIn, upload.single("avatar"), updateProfile);

module.exports = router;
