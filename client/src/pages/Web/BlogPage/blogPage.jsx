import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Vẫn cần import axios nếu dùng trực tiếp hoặc để tạo instance
import BlogCard from "../../../components/BlogCard/blogCard"; // Đường dẫn tới BlogCard
import { FaPlus } from "react-icons/fa";
import CreateNewBlog from "../../../components/CreateNewBlog/createNewBlog"; // Đường dẫn tới CreateNewBlog
import "./index.css";

// --- Lấy biến môi trường ---
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'; // Hoặc VITE_...

// --- Cấu hình Axios Instance ---
const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = token; // Hoặc `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// --- Hết cấu hình Axios ---


export default function BlogList() { // Sử dụng export default như file trước
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({ id: null, fullName: "" }); // Lưu cả id và tên

  const navigate = useNavigate();

  useEffect(() => {
    let userData = null;
    const userDataRaw = localStorage.getItem('user');
    if (userDataRaw) {
      try {
        userData = JSON.parse(userDataRaw);
        setCurrentUserInfo({
            id: userData?._id || userData?.id || null, // Lấy _id hoặc id
            fullName: userData?.fullName || userData?.name || "" // Lấy fullName hoặc name
        });
      } catch(e) {
          console.error("Error parsing user data from localStorage", e);
      }
    }


  }, []);

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/blogs'); 
        setBlogs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        let errorMessage = "Could not load blogs.";
        if (err.response) {
          errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Server error'}`;
        } else if (err.request) {
          errorMessage = 'No response from server. Check connection or API URL.';
        } else {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Fetch 1 lần khi mount

  const handleCreateNewBlog = () => {
    if (!currentUserInfo.id) {
        alert("Please log in to create a blog post.");
        return;
    }
    setShowCreateForm(true);
  };

  const handleSaveBlog = (savedBlogFromBackend) => {
    setBlogs(prevBlogs => [savedBlogFromBackend, ...prevBlogs]);
    setShowCreateForm(false);
    if (savedBlogFromBackend?._id) {
        navigate(`/blog/${savedBlogFromBackend._id}`);
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  if (isLoading) { /* ... loading ... */ }
  if (error) { /* ... error ... */ }

  return (
    <div className="container blog-list-page"> {/* Thêm class cho trang */}
      <div className="content blog-list-header" style={{ marginBottom: '20px', textAlign: 'right' }}>
        {/* Chỉ hiển thị nút Create nếu đã đăng nhập */}
        {currentUserInfo.id && (
            <button className="create-blog-btn" onClick={handleCreateNewBlog}>
              <FaPlus style={{ marginRight: '5px' }} /> Create New Blog
            </button>
        )}
      </div>

      {/* === Phần hiển thị danh sách BlogCard === */}
      <div className="flex-container blog-cards-container">
        {blogs.length === 0 && !isLoading && (
            <p>No blog posts found.</p> // Hiển thị khi không có bài viết
        )}
        {blogs.map((blog) => (
          // Link bao ngoài BlogCard
          <Link to={`/blog/${blog._id}`} key={blog._id} className="blog-card-link">
            <BlogCard blog={blog} />
          </Link>
        ))}
      </div>


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