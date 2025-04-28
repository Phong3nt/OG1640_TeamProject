import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BlogCard from "../../../components/BlogCard/blogCard";
import { FaPlus } from "react-icons/fa";
import CreateNewBlog from "../../../components/CreateNewBlog/createNewBlog";
import "./index.css";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = token; // Không thêm Bearer nếu bạn đã xác định như vậy
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({
    id: null,
    fullName: "",
  });

  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userDataRaw = localStorage.getItem("user");
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setCurrentUserInfo({
          id: userData?._id || userData?.id || null,
          fullName: userData?.fullName || userData?.name || "",
        });
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
  }, []);

  // Fetch blogs từ server
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        let errorMessage = "Could not load blogs.";
        if (err.response) {
          errorMessage = `Error ${err.response.status}: ${
            err.response.data?.message || "Server error"
          }`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Check connection or API URL.";
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateNewBlog = () => {
    if (!currentUserInfo.id) {
      alert("Please log in to create a blog post.");
      return;
    }
    setShowCreateForm(true);
  };

  const handleSaveBlog = (savedBlogFromBackend) => {
    setBlogs((prevBlogs) => [savedBlogFromBackend, ...prevBlogs]);
    setShowCreateForm(false);
    if (savedBlogFromBackend?._id) {
      navigate(`/blog/${savedBlogFromBackend._id}`);
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  // Render Loading
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading blogs...
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container blog-list-page">
      {/* Header */}
      <div
        className="content blog-list-header"
        style={{ marginBottom: "20px", textAlign: "right" }}
      >
        {currentUserInfo.id && (
          <button className="create-blog-btn" onClick={handleCreateNewBlog}>
            <FaPlus style={{ marginRight: "5px" }} /> Create New Blog
          </button>
        )}
      </div>

      {/* Blog Cards */}
      <div className="flex-container blog-cards-container">
        {blogs.length === 0 && <p>No blog posts found.</p>}
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="blog-card-link"
          >
            <BlogCard blog={blog} />
          </Link>
        ))}
      </div>

      {/* Create New Blog Form */}
      {showCreateForm && (
        <CreateNewBlog
          onClose={handleCloseForm}
          onSave={handleSaveBlog}
          fullName={currentUserInfo.fullName}
        />
      )}
    </div>
  );
}
