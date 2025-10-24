import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./PostCard.css";
import { JanContext } from "../context/JanContext";
import { toast } from "react-toastify";
import { BiSolidUpvote } from "react-icons/bi";
import { FaBookReader } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const PostCard = ({ post }) => {
  const { user, backendUrl } = useContext(JanContext);

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Do you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${backendUrl}/api/post/delete/${post.PID}`, {
        data: { UID: post.UID },
      });

      if (response.data.success) {
        toast.success("Post Deleted Successfully!");
        alert("Post Deleted");
      } else {
        toast.error("Error deleting the post");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Something went wrong while deleting!");
    }
  };

  return (
    <div className="post-card-postcard">
      <NavLink to={`/post/${post.PID}`} className="post-link-postcard">
        <div className="parent-post-media-postcard">
          {post.postType === "image" ? (
            <img
              src={post.postUrl}
              className="post-media-postcard"
              alt={post.postTitle}
            />
          ) : (
            <video
              src={post.postUrl}
              controls
              className="post-media-postcard"
            />
          )}
        </div>

        <h2 className="post-title-postcard">{post.postTitle}</h2>
        <p className="post-user-postcard">Uploaded by: {post.username}</p>
      </NavLink>

      <div className="post-likes-postcard">
        <NavLink
          to={`/post/${post.PID}`}
          className="remove-nav like-btn-new-postcard"
        >
          <BiSolidUpvote /> {post.likes ? post.likes : "0"}
        </NavLink>

        <NavLink
          to={`/post/${post.PID}`}
          className="remove-nav read-btn-postcard"
        >
          Read More <FaBookReader />
        </NavLink>

        <button
          onClick={handleDeletePost}
          className={
            post.UID === user
              ? "post-delete-btn-postcard"
              : "dis-delete-btn-postcard"
          }
        >
          <MdDelete size={18} /> Delete Post
        </button>
      </div>
    </div>
  );
};

export default PostCard;
