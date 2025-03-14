import React, { useState } from "react";
import "./PostList.css";

const PostCard = ({ title, intro, image }) => (
  <div className="post-card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{intro}</p>
  </div>
);

export const PostList = () => {
  const fakePosts = [
    { id: 1, title: "Học React từ cơ bản đến nâng cao", intro: "Cùng khám phá cách sử dụng React để xây dựng ứng dụng web hiện đại.", image: "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png" },
    { id: 2, title: "Sử dụng React Hooks như thế nào?", intro: "Tìm hiểu cách sử dụng useState, useEffect và các Hook khác.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRUIf2X_4ZYIdr9ntQu2XQ353LFHTGXhmLA&s0" },
    { id: 3, title: "Tối ưu hóa hiệu suất trong React", intro: "Học cách sử dụng memoization, lazy loading và context API.", image: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*sjp8I-aN5riVMdWzOvRGPA.jpeg" },
    { id: 4, title: "Bài viết 4", intro: "Giới thiệu bài viết 4", image: "https://via.placeholder.com/300" },
    { id: 5, title: "Bài viết 5", intro: "Giới thiệu bài viết 5", image: "https://via.placeholder.com/300" },
    { id: 6, title: "Bài viết 6", intro: "Giới thiệu bài viết 6", image: "https://via.placeholder.com/300" },
    { id: 7, title: "Bài viết 7", intro: "Giới thiệu bài viết 7", image: "https://via.placeholder.com/300" },
    { id: 8, title: "Bài viết 8", intro: "Giới thiệu bài viết 8", image: "https://via.placeholder.com/300" },
    { id: 9, title: "Bài viết 9", intro: "Giới thiệu bài viết 9", image: "https://via.placeholder.com/300" },
  ];

  const [showAll, setShowAll] = useState(false);
  const displayedPosts = showAll ? fakePosts.slice(0, 9) : fakePosts.slice(0, 3);

  return (
    <section className="post-list-section">
      <div className="post-list">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} title={post.title} intro={post.intro} image={post.image} />
        ))}
      </div>

      {fakePosts.length > 3 && (
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
