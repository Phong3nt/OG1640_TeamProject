const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  exerciseFile: { type: String }, // Đường dẫn file bài tập
  submittedFile: { type: String }, // Đường dẫn bài làm của học sinh
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
