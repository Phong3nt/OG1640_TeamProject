import React from "react";

export const PostCard = ({ title, intro, image }) => {
  return (
    <div className="post-card">
      <img src={image} alt={title} className="post-image" />
      <div className="post-content">
        <h3>{title}</h3>
        <p>{intro}</p>
      </div>
    </div>
  );
};

export default PostCard;
