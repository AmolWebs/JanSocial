import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { JanContext } from "../context/JanContext";
import PostCard from "./PostCard";
import "./Posts.css";  // ✅ new CSS for layout

const Posts = () => {
  const { backendUrl } = useContext(JanContext);
  const [postsData, setPostsData] = useState([]);

  const fetchAllPosts = async () => {
    const response = await axios.get(`${backendUrl}/api/post/`);
    const postsD = response.data.posts;
    postsD.reverse();
    setPostsData(postsD);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="posts-grid">
      {postsData.map((post) => (
        <PostCard key={post.PID} post={post} setPostsData={setPostsData} />
      ))}
    </div>
  );
};

export default Posts;
