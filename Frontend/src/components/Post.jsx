import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { JanContext } from '../context/JanContext';
import { useEffect } from 'react';
import axios from 'axios';

const Post = () => {

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [refresh, setRefresh] = useState(false);

    const { backendUrl,user } = useContext(JanContext);
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
        const response = await axios.post(`${backendUrl}/api/comment/create`, {PID: post.PID, UID: user, comment: comment});
        setComment("")

        if(response.data.success){
            alert("Comment Added Successfully")
            setRefresh(prev => !prev);
        }
        console.log(response)
    }


    useEffect(() => {
        fetchPostData()
    }, [id, refresh])



    return (
        <div>
            <div>
                <h2>{post.postTitle}</h2>
                <p>Uploaded By : {post.username}</p>
                {post.postType === "image" ?
                    <img src={post.postUrl} className='media-ele' alt="" />
                    :
                    <video src={post.postUrl} controls width="600"></video>
                }
                <p>{post.postDescription}</p>
                <button>{post.Likes}</button>
            </div>
            <div>
                {comments.map((comment)=>(
                    <div key={comment.CID} >
                        <p>{comment.comment}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={(e)=>submitComment(e)}>
                <input value={comment} onInput={(e)=>setComment(e.target.value)} type="Enter Your Comment" />
                <button type='submit' >Comment</button>
            </form>
        </div>
    )
}

export default Post
