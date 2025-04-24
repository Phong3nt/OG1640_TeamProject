import React, { useEffect, useState } from "react";
import api from "../../utils/axios"; // ✅ dùng axios instance
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./TasksPage.css";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const localUser = JSON.parse(localStorage.getItem("user"));
  const id = localUser?.id || localUser?._id;

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to get current user:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    if (id) fetchCurrentUser();
  }, [id]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <div className="tasks-page">
      <h2>Tasks</h2>

      {user?.role === "tutor" && (
        <TaskForm currentUser={user} onTaskCreated={handleTaskCreated} />
      )}

      {tasks.length === 0 ? (
        <p>Không có task nào để hiển thị.</p>
      ) : (
        <TaskList tasks={tasks} currentUser={user} />
      )}
    </div>
  );
};

export default TasksPage;
