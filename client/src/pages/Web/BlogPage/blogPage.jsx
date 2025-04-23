import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import BlogCard from "../../../components/BlogCard/blogCard";
import { FaPlus } from "react-icons/fa";
import CreateNewBlog from "../../../components/CreateNewBlog/createNewBlog";
import "./index.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(""); // 👈 để lưu tên người dùng
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy dữ liệu người dùng từ localStorage
    const userDataRaw = localStorage.getItem('user');
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);
      setUserId(userData.id || userData._id); // dùng id hoặc _id tùy backend
      setFullName(userData.name); // 👈 lấy tên (name) làm fullName
    }

    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setBlogs(response.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        let errorMessage = "Could not load blogs.";
        if (err.response) {
          errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Server error'}`;
        } else if (err.request) {
          errorMessage = 'No response from server. Check connection or API URL.';
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCreateNewBlog = () => {
    setShowCreateForm(true);
  };

  const handleSaveBlog = (savedBlogFromBackend) => {
    setBlogs(prevBlogs => [savedBlogFromBackend, ...prevBlogs]);
    setShowCreateForm(false);
    navigate(`/blog/${savedBlogFromBackend._id}`);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return <div className="container" style={{ padding: '20px', textAlign: 'center' }}>Loading blogs...</div>;
  }

  if (error) {
    return <div className="container error-message" style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="content" style={{ marginBottom: '20px', textAlign: 'right' }}>
        <button className="create-blog-btn" onClick={handleCreateNewBlog}>
          <FaPlus style={{ marginRight: '5px' }} /> Create New Blog
        </button>
      </div>

      <div className="flex-container">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} key={blog._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ cursor: 'pointer' }}>
              <BlogCard blog={blog} />
            </div>
          </Link>
        ))}
      </div>

      {showCreateForm && (
        <CreateNewBlog
          onClose={handleCloseForm}
          onSave={handleSaveBlog}
          userId={userId}
          fullName={fullName}
        />
      )}
    </div>
  );
}
