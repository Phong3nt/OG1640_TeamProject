import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";

const TaskForm = ({ onTaskCreated }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/tasks/allocated-students");
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("studentId", selectedStudent);
      formData.append("title", title);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await api.post("/tasks/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      setSelectedStudent("");
      setFile(null);
      setIsFormOpen(false); // Đóng form sau khi tạo task thành công
      onTaskCreated();
      alert("Task created successfully!");
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Error creating task.");
    }
  };

  return (
    <div className="task-form-container">
      {/* Nút Create */}
      {!isFormOpen ? (
        <button className="create-task-button" onClick={() => setIsFormOpen(true)}>
          + Create Task
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit}>
          <h3>Create Task</h3>

          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.fullName} ({s.email})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <div className="task-form-buttons">
            <button type="submit">Submit</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
