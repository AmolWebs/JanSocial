import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { JanContext } from '../context/JanContext'
import { NavLink } from 'react-router-dom'

const Profile = () => {

    const { backendUrl, user } = useContext(JanContext);
    const [userInfo, setUserInfo] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])

    const fetchData = async () => {
        try {
            const fetchUser = await axios.post(`${backendUrl}/api/user/profileData`, { UID: user });
            if (fetchUser) {
                console.log(fetchUser.data.user)
                console.log(fetchUser.data.comments)
                console.log(fetchUser.data.posts)
                setUserInfo(fetchUser.data.user)
                if (fetchUser.data.comments.length > 0) {
                    setComments(fetchUser.data.comments);
                }
                if (fetchUser.data.posts.length > 0) {
                    setPosts(fetchUser.data.posts);
                }
            }
        } catch (error) {
            // alert(error.message)
            console.log(error.message)
        }

    }

    const deleteComment = async (CID) => {
        console.log(CID)
        const response = await axios.delete(`${backendUrl}/api/comment/remove`, {data: {CID}})
        if(response.data.success){

            console.log(response.data.message)

        }
        console.log(response.data.message)
        fetchData()
    }

    useEffect(() => {
        fetchData();
    }, [user])

    return (
        <div>
            <h2>Welcome {userInfo.username}</h2>
            <div>
                <h3>My Posts</h3>
                <div>
                    {posts.length !== 0 ? posts.map((post) => (
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
                    )) 
                    :
                    <p>You had'nt posted anything yet</p>
                    }
                </div>
            </div>
            <div>
                <h3>My Comments</h3>
                <div>
                    {comments.length !== 0 ? comments.map((comment) => (
                        <div key={comment.CID} >
                            <p>{comment.comment}</p>
                            <button onClick={() => deleteComment(comment.CID)} >Delete Comment</button>
                        </div>
                    ))
                :
                <p>You had'nt commented on any post</p>
                }
                </div>
            </div>
        </div>
    )
}

export default Profile
