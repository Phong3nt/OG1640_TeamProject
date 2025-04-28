import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, currentUser, refreshTasks }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} currentUser={currentUser} refreshTasks={refreshTasks} />
      ))}
    </div>
  );
};

export default TaskList;
