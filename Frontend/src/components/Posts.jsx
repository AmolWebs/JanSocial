import React from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { JanContext } from '../context/JanContext'
import { useEffect, useState } from 'react'
import './Posts.css';
import { NavLink } from 'react-router-dom'


const Posts = () => {

    const { backendUrl, user } = useContext(JanContext);
    const [postsData, setPostsData] = useState([]);

    const fetchAllPosts = async () => {
        const response = await axios.get(`${backendUrl}/api/post/`);
        const postsD = response.data.posts;
        postsD.reverse();
        setPostsData(postsD)
    }

    useEffect(() => {
        fetchAllPosts();
    }, [])

    return (
        <div>
            {postsData.map((post) => (
                <NavLink to={`/post/${post.PID}`}>

                    <div key={post.PID}>
                        <h2>{post.postTitle}</h2>
                        <p>Uploaded By : {post.username}</p>
                        {post.postType === "image" ?
                            <img src={post.postUrl} className='media-ele' alt="" />
                            :
                            <video src={post.postUrl}></video>
                        }
                        <button>{post.Likes}</button>
                    </div>
                </NavLink>
            ))}
        </div>
    )
}



export default Posts
