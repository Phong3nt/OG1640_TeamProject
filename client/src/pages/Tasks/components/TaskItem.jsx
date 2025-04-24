import React from "react";
import CommentSection from "./CommentSection";

const TaskItem = ({ task, currentUser }) => {
  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p><strong>Mô tả:</strong> {task.description}</p>

      {/* Hiển thị file nếu có */}
      {task.filePath && (
        <p>
          <strong>File:</strong>{" "}
          <a href={`http://localhost:5000${task.filePath}`} target="_blank" rel="noreferrer">
            Xem hoặc tải về
          </a>
        </p>
      )}

      {/* Hiển thị thông tin nộp bài nếu là học sinh */}
      {task.submission && (
        <p>
          <strong>Đã nộp bài:</strong>{" "}
          <a href={`http://localhost:5000${task.submission.filePath}`} target="_blank" rel="noreferrer">
            Xem bài nộp
          </a> – {new Date(task.submission.submittedAt).toLocaleString("vi-VN")}
        </p>
      )}

      <CommentSection taskId={task._id} currentUser={currentUser} />
    </div>
  );
};

export default TaskItem;
