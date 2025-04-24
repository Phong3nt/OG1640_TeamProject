const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireSignIn } = require("../middlewares/auth");
const taskController = require("../controllers/taskController");

// Tạo thư mục uploads/tasks nếu chưa có
const uploadPath = path.join(__dirname, "..", "..", "uploads", "tasks");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Cấu hình multer để upload bài tập hoặc bài nộp
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/create", requireSignIn, upload.single("file"), taskController.createTask); // tutor tạo bài
router.get("/", requireSignIn, taskController.getTasks); // lấy toàn bộ task theo role
router.post("/:taskId/submit", requireSignIn, upload.single("file"), taskController.submitTask); // học sinh nộp bài
router.post("/:taskId/comment", requireSignIn, taskController.addComment); // comment

// ✅ Thêm route lấy danh sách học sinh đã được phân bổ cho tutor
router.get("/allocated-students", requireSignIn, taskController.getAllocatedStudents);

module.exports = router;
