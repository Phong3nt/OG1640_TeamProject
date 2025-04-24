import React, { useEffect, useState } from "react";
import api from "../../../utils/axios"; // ✅ dùng axios instance

const TaskForm = ({ currentUser, onTaskCreated }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchAllocatedStudents = async () => {
      try {
        const res = await api.get("/tasks/allocated-students");
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh:", err);
      }
    };

    if (currentUser?.role?.toLowerCase() === "tutor") {
      fetchAllocatedStudents();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("studentId", selectedStudent);
      formData.append("title", title);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await api.post("/tasks/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedStudent("");
      onTaskCreated();
    } catch (err) {
      console.error("Lỗi khi tạo task:", err);
      alert("Tạo task thất bại.");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Tạo bài tập mới</h3>

      <label>Chọn học sinh</label>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        required
      >
        <option value="">-- Chọn học sinh --</option>
        {students.map((student) => (
          <option key={student._id} value={student._id}>
            {student.fullName} ({student.email})
          </option>
        ))}
      </select>

      <label>Tiêu đề</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Mô tả</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        required
      />

      <label>Tệp đính kèm (nếu có)</label>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button type="submit">Tạo bài tập</button>
    </form>
  );
};

export default TaskForm;
