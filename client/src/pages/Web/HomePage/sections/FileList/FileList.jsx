import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

const TaskList = () => {
  const [tasksByStudent, setTasksByStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        const tasks = res.data || [];

        const grouped = {};
        tasks.forEach(task => {
          const student = task.studentId;
          if (!student) return;
          if (!grouped[student._id]) {
            grouped[student._id] = {
              studentName: student.fullName,
              tasks: [],
            };
          }
          grouped[student._id].tasks.push({
            title: task.title,
            isSubmitted: task.submission && task.submission.filePath ? true : false,
          });
        });

        setTasksByStudent(grouped);
      } catch (err) {
        console.error("Lỗi lấy tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleExpand = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <h3>Task List</h3>
      {Object.values(tasksByStudent).length === 0 ? (
        <div>Không có task nào.</div>
      ) : (
        <ul className="student-task-list">
          {Object.entries(tasksByStudent).map(([studentId, student]) => (
            <li key={studentId}>
              <div className="student-name" onClick={() => toggleExpand(studentId)}>
                {student.studentName} ({student.tasks.length} tasks, {student.tasks.filter(t => t.isSubmitted).length} done)
              </div>

              {expandedStudent === studentId && (
                <div className="task-table-wrapper">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>Task Title</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.tasks.map((task, index) => (
                        <tr key={index}>
                          <td>{task.title}</td>
                          <td>
                            {task.isSubmitted ? (
                              <span className="status-done">✅ Đã nộp</span>
                            ) : (
                              <span className="status-pending">❌ Chưa nộp</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
