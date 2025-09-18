import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { JanContext } from '../context/JanContext';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Post.css'

const Post = () => {

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [refresh, setRefresh] = useState(false);

    const { backendUrl, user } = useContext(JanContext);
    const { id } = useParams();

    const fetchPostData = async () => {
        const response = await axios.get(`${backendUrl}/api/post/${id}`);
        const commentData = response.data.comments
        if (commentData.length > 0) {
            setComments(commentData);
        }
        setPost(response.data.post)
        console.log(response);
        console.log(post)
        console.log(comments)
    }

    const submitComment = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${backendUrl}/api/comment/create`, { PID: post.PID, UID: user, comment: comment });
        setComment("")

        if (response.data.success) {
            toast.success("Comment Added Successfully")
            setRefresh(prev => !prev);
        }
        console.log(response)
    }


    useEffect(() => {
        fetchPostData()
    }, [id, refresh])



    return (
        <div className="post-container">
            <div className="post-header">
                <h2>{post.postTitle}</h2>
                <p>Uploaded By : {post.username}</p>
            </div>

            <div className="post-media">
                {post.postType === "image" ? (
                    <img src={post.postUrl} className="media-ele" alt="" />
                ) : (
                    <video src={post.postUrl} controls />
                )}
            </div>

            <button className="like-btn">{post.Likes}</button>
            <h3>Description</h3>
            <p className="post-description">{post.postDescription}</p>

            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map((comment) => (
                    <div key={comment.CID} className="comment-card">
                        <p>{comment.comment}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={submitComment} className="comment-form">
                <input
                    value={comment}
                    onInput={(e) => setComment(e.target.value)}
                    type="text"
                    placeholder="Enter your comment"
                />
                <button type="submit">Comment</button>
            </form>
        </div>

    )
}

export default Post
