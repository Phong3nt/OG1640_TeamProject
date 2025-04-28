import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FaReply, FaThumbsUp, FaUser, FaSpinner, FaTrash } from "react-icons/fa";
import axios from "axios";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import "./index.css";

// --- Environment Variables & Instances ---
const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `${token}`; // Or `Bearer ${token}`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let cld = null;
if (cloudName) {
  cld = new Cloudinary({ cloud: { cloudName }, url: { secure: true } });
} else {
  console.error(
    "Error: Cloudinary Cloud Name not configured. Images will not display."
  );
}
// --- End Instances ---

export default function BlogDetail() {
  const { id: blogId } = useParams();

  // --- State ---
  const [blog, setBlog] = useState(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [newComment, setNewComment] = useState({ content: "" });
  const [replyingTo, setReplyingTo] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  // --- End State ---

  // --- Effects ---
  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!blogId) {
        setBlogLoading(false);
        setBlogError("Blog ID missing.");
        return;
      }
      setBlog(null);
      setBlogLoading(true);
      setBlogError(null);
      try {
        const response = await api.get(`/blogs/${blogId}`);
        console.log("Blog Detail Response:", response.data);
        setBlog(response.data.blog || response.data);
      } catch (err) {
        console.error("Failed fetch blog details:", err);
        let msg = "Could not load blog details.";
        if (err.response)
          msg = err.response.data?.message || `Server error: ${err.response.status}`;
        else if (err.request) msg = "No response from server.";
        else msg = err.message;
        if (err.response?.status === 404) msg = "Blog not found.";
        setBlogError(msg);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogDetail();
  }, [blogId]);

  const fetchComments = useCallback(async () => {
    if (!blogId) {
      console.log("fetchComments called with invalid blogId, returning.");
      return;
    }
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      console.log(`Workspaceing comments for blogId: ${blogId}`); // Changed typo
      const response = await api.get(`/blogs/${blogId}/comments`);
      console.log("Fetched Comments (All):", response.data);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setCommentsError(
        err.response?.data?.message || "Could not load comments."
      );
    } finally {
      setCommentsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (blogId) {
      console.log(`useEffect detected valid blogId (${blogId}), calling fetchComments.`);
      fetchComments();
    } else {
      console.log("useEffect skipped fetchComments because blogId is missing.");
    }
  }, [fetchComments, blogId]); // Corrected dependencies

  useEffect(() => {
    // Fetch User Info
    try {
      const storedUserInfo = localStorage.getItem("user");
      if (storedUserInfo) setLoggedInUser(JSON.parse(storedUserInfo));
      else setLoggedInUser(null);
    } catch (error) {
      console.error("BlogDetail - Error reading/parsing user info:", error);
      setLoggedInUser(null);
    }
  }, []);
  // --- End Effects ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      alert("You need to log in to comment!");
      return;
    }
    const content = newComment.content.trim();
    if (!content) {
      alert("Please enter comment content!");
      return;
    }
    const isReply = !!replyingTo;
    const parentId = replyingTo?._id;
    const payload = { content, ...(isReply && { parentCommentId: parentId }) };

    console.log(">> handleSubmitComment: Submitting with payload:", payload);
    try {
      const response = await api.post(`/blogs/${blogId}/comments`, payload);
      const newSubmittedComment = response.data;
      console.log(">> handleSubmitComment: Received new comment/reply data:", JSON.stringify(newSubmittedComment, null, 2));
      console.log(">> handleSubmitComment: Updating main 'comments' state (fetch-all method)");
      setComments((prev) => [newSubmittedComment, ...prev]); // Assumes fetch-all
      setNewComment({ content: "" });
      setReplyingTo(null);
    } catch (apiError) {
      console.error("Failed to submit comment:", apiError);
      alert(`Could not submit comment: ${apiError.response?.data?.message || apiError.message}`);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setNewComment({ content: "" });
    const textarea = document.querySelector(".comment-form textarea");
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment({ content: "" });
  };

  const handleLike = async (commentId) => {
    if (!loggedInUser) {
      alert("You need to log in to like comments!");
      return;
    }
    const commentIndex = comments.findIndex((c) => c._id === commentId);
    if (commentIndex === -1) return;
    const currentComment = comments[commentIndex];
    const userId = loggedInUser._id || loggedInUser.id;
    if (!userId) {
      alert("Error: User information not found.");
      return;
    }
    const userLiked = currentComment.likes && currentComment.likes.includes(userId);
    try {
      let response;
      if (userLiked) {
        response = await api.delete(`/comments/${commentId}/like`);
      } else {
        response = await api.post(`/comments/${commentId}/like`, null);
      }
      const updatedComment = response.data;
      setComments((prev) => {
        const newComments = [...prev];
        newComments[commentIndex] = updatedComment;
        return newComments;
      });
    } catch (apiError) {
      console.error("Failed to like/unlike comment:", apiError);
      alert(`Error liking/unliking comment: ${apiError.response?.data?.message || apiError.message}`);
    }
  };

  const handleDeleteComment = useCallback(
    async (commentIdToDelete) => {
      if (deletingCommentId) return;
      const commentToDelete = comments.find((c) => c._id === commentIdToDelete);
      if (!commentToDelete) return;
      if (!window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
        return;
      }
      setDeletingCommentId(commentIdToDelete);
      try {
        console.log(`Attempting to delete comment: ${commentIdToDelete}`);
        const response = await api.delete(`/comments/${commentIdToDelete}`);
        if (response.status === 200) {
          console.log("Comment deleted successfully from backend.");
          setComments((prevComments) => {
            const commentData = prevComments.find((c) => c._id === commentIdToDelete);
            const idsToRemove = new Set([commentIdToDelete]);
            if (commentData && !commentData.parentComment) {
              console.log(`Comment ${commentIdToDelete} is top-level, finding replies...`);
              prevComments.forEach((c) => {
                if (c.parentComment === commentIdToDelete) {
                  console.log(`Adding reply ${c._id} to removal set.`);
                  idsToRemove.add(c._id);
                }
              });
            }
            const updatedComments = prevComments.filter((c) => !idsToRemove.has(c._id));
            console.log(`Updating comments state. Removed IDs:`, Array.from(idsToRemove));
            return updatedComments;
          });
        } else {
          console.error("Unexpected status code on delete:", response.status);
          alert(`Error deleting: ${response.data?.message || "Unexpected status."}`);
        }
      } catch (err) {
        console.error("Failed to delete comment:", err);
        alert(`Could not delete comment: ${err.response?.data?.message || err.message}`);
      } finally {
        setDeletingCommentId(null);
      }
    },
    [comments, deletingCommentId]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("en-GB", { // Using en-GB for DD/MM/YYYY
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };



  const CommentItem = ({ comment, isReply = false }) => {
    const [showReplies, setShowReplies] = useState(false); // State for toggling replies

    const replies = comments.filter((c) => c.parentComment === comment._id);

    const userId = loggedInUser?._id || loggedInUser?.id;
    const userLiked = userId && comment.likes ? comment.likes.includes(userId) : false;
    const currentUserId = loggedInUser?._id || loggedInUser?.id; // Consistent ID check
    const commenterId = comment.commenter?._id;
    const isAuthor = loggedInUser && comment.commenter && currentUserId && commenterId && currentUserId.toString() === commenterId.toString();
    const isDeleting = deletingCommentId === comment._id;

    console.log(`>> CommentItem [${comment._id} - Parent: ${comment.parentComment || "null"}]: Rendering. Found ${replies.length} replies. IsAuthor: ${isAuthor}`);

    const toggleReplies = () => {
      setShowReplies(prev => !prev);
    };

    return (
      <div className={`comment-item ${isReply ? "comment-reply" : ""}`}>
        <div className="comment-avatar">
          <FaUser size={isReply ? 20 : 24} />
        </div>
        <div className="comment-content-wrapper">
          <div className="comment-header">
            <strong className="comment-author">
              {comment.commenter?.fullName || "Anonymous User"}
            </strong>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="comment-content">{comment.content}</p>
          <div className="comment-actions">
            {/* Like Button */}
            <button
              className={`comment-action like-button ${userLiked ? "active" : ""}`}
              onClick={() => handleLike(comment._id)}
              disabled={!loggedInUser || isDeleting}
            >
              <FaThumbsUp size={14} />
              <span>{comment.likes?.length > 0 ? comment.likes.length : ""}</span>
            </button>
            {/* Reply Button */}
            {loggedInUser && (
              <button
                className="comment-action reply-button"
                onClick={() => handleReply(comment)}
                disabled={isDeleting}
              >
                <FaReply size={14} /> Reply
              </button>
            )}
            {/* Delete Button */}
            {isAuthor && (
              <button
                type="button"
                className="comment-action delete-button"
                onClick={() => handleDeleteComment(comment._id)}
                disabled={isDeleting}
                title="Delete this comment"
                style={{ color: "red", marginLeft: "10px" }}
              >
                {isDeleting ? <FaSpinner className="spin" size={14} /> : <FaTrash size={14} />}
              </button>
            )}
            {/* View/Hide Replies Button */}
            {replies.length > 0 && (
              <button
                className="comment-action view-replies-button"
                onClick={toggleReplies}
                disabled={isDeleting}
              >
                {showReplies ? 'Hide Replies' : ` ${replies.length} ${replies.length > 1 ? 'Replies' : 'Reply'}`}
              </button>
            )}
          </div>
          {/* Replies Section (Conditionally Rendered) */}
          {showReplies && replies.length > 0 && (
            <div className="comment-replies">
              {console.log(`>> CommentItem [${comment._id}]: Rendering replies section with ${replies.length} items.`)}
              {replies.map((reply) => (
                <CommentItem key={reply._id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Render Logic ---
  if (blogLoading) return <div className="container loading">Loading post...</div>;
  if (blogError) return <div className="container error">{`Error loading post: ${blogError}`}</div>;
  if (!blog) return <div className="container">Post not found.</div>;

  // Prepare Cloudinary Image
  const publicId = blog.coverImage;
  const blogCoverImage = publicId && cld ? cld.image(publicId) : null;
  // if (blogCoverImage) { /* ... transformations ... */ }

  // Filter top-level comments for initial render
  const mainComments = comments.filter((comment) => !comment.parentComment);

  return (
    <div className="container">
      <div className="blog-detail">
        {/* Header */}
        <div className="blog-header">
          {blogCoverImage ? (
            <AdvancedImage
              cldImg={blogCoverImage}
              alt={blog.title || "Blog cover"}
              className="blog-cover"
            />
          ) : blog.coverImage && !cld ? (
            <p style={{ color: "red" }}>Cloudinary configuration error!</p>
          ) : (
            <div className="blog-cover-placeholder">No Cover Image</div>
          )}
          <h2 className="blog-title">{blog.title || "No Title"}</h2>
          <div className="blog-author">
            <span className="author-name">
              {blog.author?.fullName || blog.author?.username || "Unknown Author"}
            </span>
            {blog.createdAt && (
              <span className="published-date">{formatDate(blog.createdAt)}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="blog-content">
          {blog.description ? (
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          ) : (
            <p>No description available.</p>
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({mainComments.length})</h3>
          {/* Comment Form */}
          {loggedInUser ? (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              {replyingTo && (
                <div className="replying-to">
                  <p>
                    Replying to{" "}
                    <strong>
                      {replyingTo.commenter?.username ||
                        replyingTo.commenter?.fullName ||
                        "Anonymous User"}
                    </strong>
                  </p>
                  <button
                    type="button"
                    className="cancel-reply-inline"
                    onClick={cancelReply}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="form-group">
                <textarea
                  id="content"
                  name="content"
                  value={newComment.content}
                  onChange={handleInputChange}
                  placeholder={
                    replyingTo
                      ? `Write your reply...`
                      : `Write a comment as ${loggedInUser.fullName || loggedInUser.username
                      }...`
                  }
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-comment"
                  disabled={commentsLoading} // Consider adding an isSubmitting state
                >
                  {replyingTo ? "Send Reply" : "Send Comment"}
                </button>
              </div>
            </form>
          ) : (
            <p>
              You need to <Link to="/login">log in</Link> to comment.
            </p>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {commentsLoading && <p>Loading comments...</p>}
            {commentsError && (
              <p className="error-message">
                Error loading comments: {commentsError}
              </p>
            )}
            {!commentsLoading && !commentsError && mainComments.length === 0 && (
              <p className="no-comments">No comments yet.</p>
            )}
            {!commentsLoading && !commentsError && mainComments.length > 0 && (
              mainComments.map((comment) => (
                // CommentItem defined above implicitly gets props from scope
                <CommentItem key={comment._id} comment={comment} />
              ))
            )}
          </div>
        </div> {/* End comments-section */}
      </div> {/* End blog-detail */}
    </div> /* End container */
  );
}