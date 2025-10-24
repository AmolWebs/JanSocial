import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { JanContext } from '../context/JanContext'
import { NavLink } from 'react-router-dom'
import PostCard from '../components/PostCard'
import './Profile.css'
import { toast } from 'react-toastify'
import { Divide } from 'lucide-react'

const Profile = () => {

    const { backendUrl, user } = useContext(JanContext);
    const [userInfo, setUserInfo] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])

    const fetchData = async () => {
        try {
            const fetchUser = await axios.post(`${backendUrl}/api/user/profileData`, { UID: user });
            console.log("FetchUser is : ", fetchUser)
            if (fetchUser) {
                console.log(fetchUser.data.user)
                console.log(fetchUser.data.comments)
                console.log(fetchUser.data.posts)
                setUserInfo(fetchUser.data.user)
                console.log("user information is : ",userInfo)
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
        const response = await axios.delete(`${backendUrl}/api/comment/remove`, { data: { CID } })
        if (response.data.success) {
            toast.success("Comment deleted successfully")
            console.log(response.data.message)

        }
        else{
            toast.error("Error while deleting comment")
        }
        console.log(response.data.message)
        fetchData()
    }

    useEffect(() => {
        fetchData();
    }, [user])

    return (
        <div>
            <h2 className='welcome-msg-profile' >Welcome {userInfo.username} 👋 </h2>
            <div >
                <h3 className='user-posts-profile' >My Posts</h3>
                <div className="posts-grid" >
                    {posts.length !== 0 ? posts.map((post) => (
                        <div className="post-link">
                            <PostCard key={post.PID} post={post} />
                        </div>
                    ))
                        :
                        <p>You had'nt posted anything yet</p>
                    }
                </div>
            </div>
            <div className="my-comments-container">
                <h3>My Comments</h3>
                <div>
                    {comments.length !== 0 ? (
                        comments.map((comment) => (
                            <div key={comment.CID} className="comment-card">
                                <p>{comment.comment}</p>
                                <button
                                    onClick={() => deleteComment(comment.CID)}
                                    className="delete-btn"
                                >
                                    Delete Comment
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="empty-comments">You hadn't commented on any post</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
