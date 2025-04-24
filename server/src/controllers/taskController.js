const Task = require("../models/Task");
const Allocation = require("../models/TutorAllocation");
const mongoose = require("mongoose");

// Tạo task (chỉ tutor)
exports.createTask = async (req, res) => {
  const { studentId, title, description } = req.body;
  const tutorId = req.user.id;

  try {
    const allocation = await Allocation.findOne({
      tutor: tutorId,
      student: studentId,
      status: "active",
    });

    if (!allocation) {
      return res.status(403).json({ message: "Bạn không được phép tạo task cho student này." });
    }

    const filePath = req.file ? "/uploads/tasks/" + req.file.filename : "";

    const task = new Task({
      tutorId,
      studentId,
      title,
      description,
      filePath,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Lỗi tạo task:", err);
    res.status(500).json({ message: "Lỗi server khi tạo task." });
  }
};

// Lấy danh sách task theo role
exports.getTasks = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let tasks;
    if (role === "tutor") {
      tasks = await Task.find({ tutorId: userId });
    } else if (role === "student") {
      tasks = await Task.find({ studentId: userId });
    } else {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Lỗi lấy danh sách task:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách task." });
  }
};

// Nộp bài (chỉ student)
exports.submitTask = async (req, res) => {
  const studentId = req.user.id;
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task || task.studentId.toString() !== studentId) {
      return res.status(403).json({ message: "Bạn không có quyền nộp bài cho task này." });
    }

    const submissionPath = req.file ? "/uploads/tasks/" + req.file.filename : "";

    task.submission = {
      filePath: submissionPath,
      submittedAt: new Date(),
    };

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Lỗi nộp bài:", err);
    res.status(500).json({ message: "Lỗi server khi nộp bài." });
  }
};

// Bình luận (tutor và student)
exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const { text } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task không tồn tại." });
    }

    task.comments.push({
      userId,
      text,
      createdAt: new Date(),
    });

    await task.save();
    res.status(201).json(task.comments);
  } catch (err) {
    console.error("Lỗi bình luận:", err);
    res.status(500).json({ message: "Lỗi server khi thêm bình luận." });
  }
};

// ✅ Lấy danh sách học sinh được phân bổ cho tutor hiện tại
exports.getAllocatedStudents = async (req, res) => {
  const tutorId = req.user.id;
  try {
    const allocations = await Allocation.find({ tutor: tutorId, status: 'active' })
      .populate('student', 'fullName email');

    const students = allocations.map(a => a.student);
    res.status(200).json({ students });
  } catch (err) {
    console.error("Lỗi lấy danh sách học sinh:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách học sinh." });
  }
};
