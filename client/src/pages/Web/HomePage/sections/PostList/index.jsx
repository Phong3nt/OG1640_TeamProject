import React, { useState } from "react";
import PostCard from "../../../../../components/PostCard";

export const PostList = () => {
  // Dữ liệu giả
  const fakePosts = [
    { id: 1, title: "Học React từ cơ bản đến nâng cao", intro: "Cùng khám phá cách sử dụng React để xây dựng ứng dụng web hiện đại.", image: "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png" },
    { id: 2, title: "Sử dụng React Hooks như thế nào?", intro: "Tìm hiểu cách sử dụng useState, useEffect và các Hook khác.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRUIf2X_4ZYIdr9ntQu2XQ353LFHTGXhmLA&s0" },
    { id: 3, title: "Tối ưu hóa hiệu suất trong React", intro: "Học cách sử dụng memoization, lazy loading và context API.", image: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*sjp8I-aN5riVMdWzOvRGPA.jpeg" },
    { id: 4, title: "Bài viết 4", intro: "Giới thiệu bài viết 4", image: "https://via.placeholder.com/300" },
    { id: 5, title: "Bài viết 5", intro: "Giới thiệu bài viết 5", image: "https://via.placeholder.com/300" },
  ];

  const [showAll, setShowAll] = useState(false);

  const displayedPosts = showAll ? fakePosts : fakePosts.slice(0, 3);

  return (
    <section className="post-list-section">
      <div className="post-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} title={post.title} intro={post.intro} image={post.image} />
        ))}
      </div>

      {fakePosts.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showAll ? "Less" : "More"}
          </button>
        </div>
      )}
    </section>
  );
};

export default PostList;
