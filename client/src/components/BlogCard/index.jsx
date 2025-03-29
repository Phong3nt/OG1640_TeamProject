import React from "react";
import "./index.css"
export default function BlogCard({ blog }) {
    return (
        <div className="blog-card ">
        <div className="image-container">
          <img src={blog.coverImg} className="cover-image" alt="" />
        </div>
        <div className="content-overlay flex-column">
          <div className="content-spacer flex-grow"></div>
          <div className="content-details flex-column">
            <div className="header flex-row">
              <h1 className="publish-date">{blog.publishedDate}</h1>
              <div className="author-info flex-row">
                <div className="author-image-container">
                  <img
                    src={blog.authorImg}
                    className="author-image"
                    alt=""
                  />
                </div>
                <h1 className="author-name">{blog.authorName}</h1>
              </div>
            </div>
            <h1 className="blog-title">{blog.title}</h1>
          </div>
        </div>
      </div>
      );
}
