import React, { useEffect, useState } from "react";
import axios from "axios";

export const PostCommentManagement = () => {
  const [postStats, setPostStats] = useState({});

  useEffect(() => {
    fetchPostStats();
  }, []);

  const fetchPostStats = async () => {
    try {
      const response = await axios.get("/api/staff/post-stats");
      setPostStats(response.data);
    } catch (error) {
      console.error("Error fetching post stats", error);
    }
  };

  return (
    <section>
      <h2>Post & Comment Management</h2>
      <p>Total Posts: {postStats.totalPosts}</p>
      <p>Total Comments: {postStats.totalComments}</p>
    </section>
  );
};
