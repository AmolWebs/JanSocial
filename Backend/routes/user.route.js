import express from 'express'
import User from '../models/user.model.js'
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.log("Error while get users");
        return res.json({ success: false, message: "Error while fetching users data" })
    }
});


router.post('/register', async (req, res) => {

    try {
        const { username, password } = req.body;
        const dbUser = await User.findOne({username: username});
        if(dbUser){
            return res.status(500).json({success: false, message: "Username already exists"});
        }
        else{
            const user = await User.create({username, password});
            return res.json({ success: true, message: "Registration Successful", user });
        }

    } catch (error) {
        return res.status(400).json({success: false, message: "Error while Registration",error: error})
    }

})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.password === password) {
            return res.json({ success: true, message: "Login Successful", user });
        }
        else {
            return res.json({ success: false, message: "Login Failed : Wrong Password" });
        }
    } catch (error) {
        console.log("Backend : Error while Login : ", error)
        return res.json({ success: false, message: "Error while login"   })
    }
});

// this route is for profile page to get user posts and comments

router.post('/profileData', async(req, res) => {
    const { UID } = req.body;
    const user = await User.findOne({UID: UID});
    if(!user){
        return res.status(500).json({success: false, message:"Invalid user ID"});
    }

    const posts = await Post.find({ PID: { $in: user.user_Posts } });;
    const comments = await Comment.find({ CID : {$in: user.user_Comments}});


    res.json({success: true, user, posts, comments});
})

export default router;