import React, { useEffect, useState } from "react";
import api from "../../../utils/axios";

const CommentSection = ({ taskId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Lỗi khi lấy bình luận:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await api.post(`/tasks/${taskId}/comment`, { text });
      setComments(res.data);
      setText("");
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Bình luận</h4>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Nhập bình luận..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Gửi</button>
      </form>
      <ul className="comment-list">
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.userId?.fullName || "User"}:</strong> {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
