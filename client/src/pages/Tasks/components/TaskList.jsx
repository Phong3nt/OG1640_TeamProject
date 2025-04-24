import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, currentUser }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default TaskList;
