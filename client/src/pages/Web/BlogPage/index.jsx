import React from "react";
import { useState, useEffect } from "react";
import BlogCard from "../../../components/BlogCard";
import "./index.css"
import { FaSun, FaMoon, } from "react-icons/fa";

export default function App() {
  const [blogs, setBlogs] = useState([
    {
      coverImg:
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
      title: "Boost your conversation Rate",
      authorImg:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=570&q=80",
      authorName: "Michale Foster",
      publishedDate: new Date().toDateString(),
    },
    {
      coverImg:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
      title: "33 Powerful Self-Reflection Questions for Personal Growth",
      authorImg:
        "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
      authorName: "Tom Wick",
      publishedDate: new Date().toDateString(),
    },
    {
      coverImg:
        "https://images.unsplash.com/photo-1564540574859-0dfb63985953?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
      title: "Digital Detox: Reclaiming Your Focus and Creativity in a Distracted World.",
      authorImg:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
      authorName: "Karl Magnuson",
      publishedDate: new Date().toDateString(),
    },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newBlog, setNewBlog] = useState({
    coverImg: "",
    title: "",
    authorImg: "",
    authorName: "",
    publishedDate: new Date().toDateString(),
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);
  const handleInputChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBlogs([...blogs, newBlog]);
    //reset các state của new blog.
    setNewBlog({
      coverImg: "",
      title: "",
      authorImg: "",
      authorName: "",
      publishedDate: new Date().toDateString(),
    });
    setShowForm(false); // Ẩn form sau khi submit
  };

  return (
    <div className="container">
      <div className="dark-mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>
      <div className="content">
        <h1 className="title">Random Title</h1>
        <p className="description">
          Passionate about brain optimization, life hacks, and healthy success
          habits to empower individuals.
        </p>
      </div>
      <div className="grid-container">
        {blogs.map((blog, index) => (
          <BlogCard blog={blog} key={index} />
        ))}
      </div>
      <button onClick={() => setShowForm(true)}>Tạo bài post mới</button>

      {/* Form tạo bài post (hiển thị có điều kiện) */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            value={newBlog.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="authorName"
            placeholder="Tên tác giả"
            value={newBlog.authorName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="coverImg"
            placeholder="Link ảnh bìa"
            value={newBlog.coverImg}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="authorImg"
            placeholder="Link ảnh tác giả"
            value={newBlog.authorImg}
            onChange={handleInputChange}
          />
          <button type="submit">Tạo bài post</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Hủy
          </button> {/* Nút hủy */}
        </form>
      )}
    </div>
  );
}
