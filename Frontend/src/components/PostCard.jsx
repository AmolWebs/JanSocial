import React from "react";
import { NavLink } from "react-router-dom";
import "./PostCard.css"; // separate styling file
import { useContext } from "react";
import { JanContext } from "../context/JanContext";
import { toast } from "react-toastify";
import { BiSolidUpvote } from "react-icons/bi";
import { FaBookReader } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const PostCard = ({ post }) => {

  const { user, navigate, backendUrl } = useContext(JanContext)

  const handleDeletePost = async () => {
    const confirm = window.confirm("Do you want to delete the post?");
    if (!confirm) return;
    const response = await axios.delete(`${backendUrl}/api/post/delete/${post.PID}`, { data: { UID: post.UID } })
    console.log("Response is : ", response)
    console.log("Response.data is : ", response.data)
    if (response.data.success) {
      toast.success("Post Deleted Successfully !")
      alert("Post Deleted")
    }
    else {
      toast.error("Error in deletion of post")
    }
  }

  console.log(post)
  return (
    <div className="post-card-postcard">
      <NavLink to={`/post/${post.PID}`} className="post-link-postcard">


        <div className="parent-post-media-postcard">

          {post.postType === "image" ? (
            <img src={post.postUrl} className="post-media-postcard" alt={post.postTitle} />
          ) : (
            <video src={post.postUrl} controls className="post-media-postcard" />
          )}
        </div>

        <h2 className="post-title-postcard">{post.postTitle}</h2>
        <p className="post-user-postcard">Uploaded By : {post.username}</p>
      </NavLink>

      <div className="post-likes-postcard">
        <NavLink to={`/post/${post.PID}`} className="remove-nav like-btn-new-postcard"> <BiSolidUpvote />{post.likes ? post.likes : "0"}</NavLink>
        <NavLink to={`/post/${post.PID}`} className="remove-nav read-btn-postcard">Read More <FaBookReader /></NavLink>
        <button onClick={() => handleDeletePost()} className={post.UID === user ? "post-delete-btn-postcard" : "dis-delete-btn-postcard"}>
          <MdDelete size={20} /> Delete Post
        </button>
      </div>

    </div>
  );
};

export default PostCard;
