import React, { useEffect, useState } from "react";
import "./PostList.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BlogCard from "../../../../../components/BlogCard/blogCard";


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



export const PostList = () => {

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({ id: null, fullName: "" }); // Lưu cả id và tên

  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();



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
  }, []);

  return (
    <section className="post-list-section">
      <div className="post-list">
        {blogs.map((blog) => (
          <BlogCard blog={blog} />
        ))}
      </div>

      {blogs.length > 3 && (
        <div className="text-center">
          <button onClick={() => setShowAll(!showAll)} className="more-button">
            {showAll ? "Less" : "More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default PostList;
