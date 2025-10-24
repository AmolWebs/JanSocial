import React from "react";
import { NavLink } from "react-router-dom";
import "./PostCard.css"; // separate styling file
import { useContext } from "react";
import { JanContext } from "../context/JanContext";
import { toast } from "react-toastify";
import axios from "axios";

const PostCard = ({ post }) => {

  const { user, navigate, backendUrl } = useContext(JanContext)

  const handleDeletePost = async () => {
    const confirm = window.confirm("Do you want to delete the post?");
    if (!confirm) return;
    const response = await axios.delete(`${backendUrl}/api/post/delete/${post.PID}`,{data: {UID: post.UID}})
    console.log( "Response is : ", response)
    console.log("Response.data is : ",response.data)
    if(response.data.success){
      toast.success("Post Deleted Successfully !")
      alert("Post Deleted")
    }
    else{
      toast.error("Error in deletion of post")
    }
  }

  console.log(post)
  return (
    <div className="post-card-postcard">
      <NavLink to={`/post/${post.PID}`} className="remvoe-nav post-link-postcard">
        <h2 className="post-title-postcard">{post.postTitle}</h2>
        <p className="post-user-postcard">Uploaded By : {post.username}</p>

        {post.postType === "image" ? (
          <img src={post.postUrl} className="post-media-postcard" alt={post.postTitle} />
        ) : (
          <video src={post.postUrl} controls className="post-media-postcard" />
        )}
      </NavLink>

      <div className="post-likes-postcard">
        <NavLink to={`/post/${post.PID}`} className="remvoe-nav like-btn-new-postcard">Upvote : {post.likes ? post.likes : "0"}</NavLink>
        <NavLink to={`/post/${post.PID}`} className="remvoe-nav read-btn-postcard">Read More</NavLink>
        <button onClick={()=>handleDeletePost()} className={post.UID === user ? "post-delete-btn-postcard" : "dis-delete-btn-postcard"}>
          Delete Post
        </button>
      </div>

    </div>
  );
};

export default PostCard;
