const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    filePath: {
      type: String, // File bài tập do tutor upload
    },
    submission: {  // ✅ Học sinh nộp bài
      filePath: { type: String },
      submittedAt: { type: Date }
    },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userRole: { type: String, enum: ["student", "tutor"], required: true }, // 👈 Thêm dòng này
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
