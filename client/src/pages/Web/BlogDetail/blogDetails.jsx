import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {FaReply, FaThumbsUp, FaUser } from "react-icons/fa";
import axios from 'axios';
import "./index.css";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Đổi thành 'token'
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default function BlogDetail() {
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authToken, setAuthToken] = useState(null); // Vẫn giữ state này để check trong submit

  const [newComment, setNewComment] = useState({ content: "" });
  const [replyingTo, setReplyingTo] = useState(null);


  useEffect(() => {

    const fetchBlogDetail = async () => {
      setBlog(null);
      setBlogLoading(true);
      setBlogError(null);
      if (!blogId) {
        setBlogLoading(false);
        setBlogError("Blog ID is missing.");
        return;
      };
      try {
        const response = await api.get(`/blogs/${blogId}`);
        console.log('Blog Detail Response:', response.data);
        setBlog(response.data);
      } catch (err) {
        console.error("Failed to fetch blog details:", err);
        let errorMessage = "Could not load blog details.";
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = "Blog not found.";
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
        } else if (err.request) {
          errorMessage = "No response from server.";
        }
        setBlogError(errorMessage);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogDetail();
  }, [blogId]);


  const fetchComments = useCallback(async () => {
    if (!blogId) return;
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = await api.get(`/blogs/${blogId}/comments`);
      console.log('Comments Response:', response.data);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setCommentsError(err.response?.data?.message || "Could not load comments.");
    } finally {
      setCommentsLoading(false);
    }
  }, [blogId]);
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);


 

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('user'); 
      const storedToken = localStorage.getItem('token'); 

      console.log("BlogDetail - Đọc từ localStorage ('user'):", storedUserInfo);
      console.log("BlogDetail - Đọc từ localStorage ('token'):", storedToken); 


      if (storedUserInfo) {
        const parsedUser = JSON.parse(storedUserInfo);
        console.log("BlogDetail - Dữ liệu user sau khi parse:", parsedUser);
        setLoggedInUser(parsedUser);
      } else {
        console.log("BlogDetail - Không tìm thấy 'user' trong localStorage.");
        setLoggedInUser(null);
      }

      if (storedToken) {
        setAuthToken(storedToken); 
        console.log("BlogDetail - Đã tìm thấy Auth token (key 'token')."); 
      } else {
        console.log("BlogDetail - Không tìm thấy 'token' trong localStorage."); 
        setAuthToken(null);
      }
    } catch (error) {
      console.error("BlogDetail - Lỗi khi đọc/parse user info/token:", error);
      setLoggedInUser(null);
      setAuthToken(null);
    }
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

 
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    console.log("handleSubmitComment - Giá trị state KHI CLICK:", { loggedInUser, authToken });

    if (!loggedInUser || !authToken) { 
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }

    const content = newComment.content.trim();
    if (!content) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }
    const payload = {
      content: content,
      ...(replyingTo && { parentCommentId: replyingTo._id })
    };
    console.log("Submitting comment/reply with payload:", payload);
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, payload);
      console.log("Dữ liệu comment trả về từ Backend:", JSON.stringify(response.data, null, 2));
      console.log("Comment submission response:", response.data);
      setComments(prev => [response.data, ...prev]);
      setNewComment({ content: "" });
      setReplyingTo(null);
    } catch (apiError) {
      console.error("Failed to submit comment:", apiError);
      alert(`Không thể gửi bình luận: ${apiError.response?.data?.message || apiError.message}`);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setNewComment({ content: "" });
    document.querySelector(".comment-form textarea")?.focus();
    document.querySelector(".comment-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment({ content: "" });
  };

  const handleLike = async (commentId) => {
    if (!loggedInUser || !authToken) {
      alert("Bạn cần đăng nhập để thích bình luận!");
      return;
    }
    const currentComment = comments.find(c => c._id === commentId);
    if (!currentComment) return;
    const userId = loggedInUser._id || loggedInUser.id;
    if (!userId) {
      console.error("Không tìm thấy User ID trong loggedInUser object:", loggedInUser);
      alert("Lỗi: Không tìm thấy thông tin người dùng.");
      return;
    }
    const userLiked = currentComment.likes.includes(userId);
    try {
      let response;
      if (userLiked) {
        console.log(`Unliking comment: ${commentId}`);
        response = await api.delete(`/comments/${commentId}/like`); // Dùng instance 'api'
      } else {
        console.log(`Liking comment: ${commentId}`);
        response = await api.post(`/comments/${commentId}/like`, null); // Dùng instance 'api'
      }
      console.log("Like/Unlike response:", response.data);
      setComments(prev => prev.map(comment =>
        comment._id === commentId ? response.data : comment
      ));
    } catch (apiError) {
      console.error("Failed to like/unlike comment:", apiError);
      alert(`Lỗi khi thích/bỏ thích: ${apiError.response?.data?.message || apiError.message}`);
    }
  };

 
  const mainComments = comments.filter(comment => !comment.parentComment);
  const getRepliesFor = (commentId) => {
    return comments.filter(comment => comment.parentComment === commentId);
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  const CommentItem = ({ comment, isReply = false }) => {
    const replies = getRepliesFor(comment._id);
    const userId = loggedInUser?._id || loggedInUser?.id;
    const userLiked = userId ? comment.likes.includes(userId) : false;

    return (
      <div className={`comment-item ${isReply ? 'comment-reply' : ''}`}>
        <div className="comment-avatar">
          <FaUser size={isReply ? 20 : 24} />
        </div>
        <div className="comment-content-wrapper">
          <div className="comment-header">
            <strong className="comment-author">{comment.commenter.fullName || 'Người dùng ẩn'}</strong>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="comment-content">{comment.content}</p>
          <div className="comment-actions">
            <button
              className={`comment-action like-button ${userLiked ? 'active' : ''}`}
              onClick={() => handleLike(comment._id)}
              disabled={!loggedInUser}
            >
              <FaThumbsUp size={14} />
              <span>{comment.likes.length > 0 ? comment.likes.length : ''}</span>
            </button>
            {loggedInUser && (
              <button className="comment-action reply-button" onClick={() => handleReply(comment)}>
                <FaReply size={14} /> Trả lời
              </button>
            )}
          </div>

          {replies.length > 0 && (
            <div className="comment-replies">
              {replies.map(reply => (
                <CommentItem key={reply._id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };


  // --- Render Logic (Giữ nguyên) ---
  if (blogLoading) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}>Đang tải bài viết...</div>;
  if (blogError) return <div className="container error-message" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Lỗi tải bài viết: {blogError}</div>;
  if (!blog) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}>Không tìm thấy bài viết.</div>;

  return (
    <div className="container">
      <div className="blog-detail">
        <div className="blog-header">
          {blog.coverImage && <img src={blog.coverImage} alt={blog.title || 'Blog cover'} className="blog-cover" />}
          <h2 className="blog-title">{blog.title || 'No Title'}</h2>
          <div className="blog-author">
            <span className="author-name">{blog.author?.fullName || blog.author?.username || 'Unknown Author'}</span>
            {blog.createdAt && <span className="published-date">{formatDate(blog.createdAt)}</span>}
          </div>
        </div>

        <div className="blog-content">
          {blog.description ? (
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          ) : (
            <p>No description available.</p>
          )}
        </div>

        <div className="comments-section">
          <h3 className="comments-title">Bình luận ({comments.length > 0 ? comments.length : '0'})</h3>

          {loggedInUser ? (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              {replyingTo && (
                <div className="replying-to">
                  <p>Đang trả lời <strong>{replyingTo.commenter?.username || replyingTo.commenter?.fullName || 'Người dùng ẩn'}</strong></p>
                </div>
              )}
              <div className="form-group">
                <textarea
                  id="content"
                  name="content"
                  value={newComment.content}
                  onChange={handleInputChange}
                  placeholder={replyingTo ? `Viết trả lời của bạn...` : `Viết bình luận với tư cách ${loggedInUser.name || loggedInUser.fullName || loggedInUser.username}...`}
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-comment" disabled={commentsLoading}>
                  {replyingTo ? "Gửi trả lời" : "Gửi bình luận"}
                </button>
                {replyingTo && (
                  <button type="button" onClick={cancelReply} className="cancel-reply">Hủy</button>
                )}
              </div>
            </form>
          ) : (
            <p>Bạn cần <Link to="/login">đăng nhập</Link> để bình luận.</p>
          )}

          <div className="comments-list">
            {commentsLoading && <p>Đang tải bình luận...</p>}
            {commentsError && <p className="error-message">Lỗi tải bình luận: {commentsError}</p>}
            {!commentsLoading && !commentsError && mainComments.length === 0 && (
              <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            )}
            {!commentsLoading && !commentsError && mainComments.length > 0 && (
              mainComments.map(comment => (
                <CommentItem key={comment._id} comment={comment} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}