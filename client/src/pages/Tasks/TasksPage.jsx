import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./TasksPage.css";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser) return;
    try {
      const res = await api.get(`/users/${localUser._id || localUser.id}`);
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
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
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <div className="tasks-page">
      <h2>Tasks</h2>
      {user?.role === "tutor" && <TaskForm onTaskCreated={handleTaskCreated} />}
      <TaskList tasks={tasks} currentUser={user} refreshTasks={fetchTasks} />
    </div>
  );
};

export default TasksPage;
