import React from "react";
import { NavLink } from "react-router-dom";
import "./PostCard.css"; // separate styling file

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <NavLink to={`/post/${post.PID}`} className="post-link">
        <h2 className="post-title">{post.postTitle}</h2>
        <p className="post-user">Uploaded By : {post.username}</p>

        {post.postType === "image" ? (
          <img src={post.postUrl} className="post-media" alt={post.postTitle} />
        ) : (
          <video src={post.postUrl} controls className="post-media" />
        )}

        <div className="post-actions">
          <button className="like-btn">❤️ {post.Likes}</button>
        </div>
      </NavLink>
    </div>
  );
};

export default PostCard;
