import React from "react";
import "./index.css";

export default function BlogCard({ blog }) {
  return (
    <div className="blog-card">
      <div className="image-container">
        <img src={blog.coverImage} className="cover-image" alt="cover" />
      </div>
      <div className="content-overlay flex-column">
        <div className="content-spacer flex-grow"></div>
        <div className="content-details flex-column">
          <div className="header flex-row">
            <h1 className="publish-date">
              {new Date(blog.createdAt).toLocaleDateString()}
            </h1>
            <div className="author-info flex-row">
              <div className="author-image-container">
                <img
                  src={blog.author?.avatar || "/default-avatar.png"}
                  className="author-image"
                  alt="author"
                />
              </div>
              <h1 className="author-name">{blog.author?.fullName || "Unknown"}</h1>
            </div>
          </div>
          <h1 className="blog-title">{blog.title}</h1>
        </div>
      </div>
    </div>
  );
}
