import React, { useState } from "react";
import api from "../../../utils/axios";

const TaskItem = ({ task, currentUser, refreshTasks }) => {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isStudent = currentUser?.role === "student";
  const isTutor = currentUser?.role === "tutor";
  const hasSubmitted = !!task.submission?.filePath;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      await api.post(`/tasks/${task._id}/comment`, { text: commentText.trim() });
      setCommentText("");
      refreshTasks();
    } catch (err) {
      console.error("Failed to comment:", err);
      alert("Error submitting comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/tasks/${task._id}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refreshTasks();
    } catch (err) {
      console.error("Failed to submit file:", err);
      alert("Error submitting file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="task-item">
      {/* Title only - clickable */}
      <h3 onClick={toggleExpand} style={{ cursor: "pointer" }}>
        {task.title}
      </h3>

      {isExpanded && (
        <>
          <p><strong>Description:</strong> {task.description}</p>

          {task.filePath && (
            <p><strong>Attachment:</strong>{" "}
              <a href={`http://localhost:5000${task.filePath}`} target="_blank" rel="noopener noreferrer">
                View File
              </a>
            </p>
          )}

          <p><strong>Assigned to:</strong> {task.studentId?.fullName || "Unknown"}</p>

          {/* Submission */}
          {isStudent && (
            <>
              {hasSubmitted ? (
                <div>
                  <p><em>You have submitted this task.</em></p>
                  <a href={`http://localhost:5000${task.submission.filePath}`} target="_blank" rel="noopener noreferrer">
                    View Your Submission
                  </a>
                </div>
              ) : (
                <div>
                  <input type="file" onChange={handleFileSubmit} disabled={uploading} />
                  {uploading && <p>Submitting...</p>}
                </div>
              )}
            </>
          )}

          {isTutor && hasSubmitted && (
            <p>
              <strong>Student's Submission:</strong>{" "}
              <a href={`http://localhost:5000${task.submission.filePath}`} target="_blank" rel="noopener noreferrer">
                View Submission
              </a>
            </p>
          )}

          {/* Comment Section */}
          <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder={`Comment as ${isTutor ? "Tutor" : "Student"}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
              />
              <button type="submit" disabled={submitting || !commentText.trim()}>
                Send
              </button>
            </form>

            <div className="comments-list">
              <h4>Comments:</h4>
              {task.comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                task.comments.map((comment, idx) => (
                  <p key={idx}>
                    <strong>{comment.userRole === "tutor" ? "Tutor" : "Student"}:</strong> {comment.text}
                  </p>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
