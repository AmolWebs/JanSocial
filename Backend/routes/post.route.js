import express, { response } from 'express'
import fs from 'fs'
import imagekit from '../config/imagekit.js'
import multer from "multer";
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js'

const router = express.Router();
// const upload = multer({ dest: "/tmp", limits: { fileSize: 5 * 1024 * 1024 } });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });


//Get all the posts uploaded by the users

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().lean(); // lean() gives plain JS objects

        // 2️⃣ Fetch all users to map UID → username
        const users = await User.find({}, { UID: 1, username: 1 }).lean();
        const uidToUsername = {};
        users.forEach(user => {
            uidToUsername[user.UID] = user.username;
        });

        // 3️⃣ Replace UID with username
        const postsWithUsername = posts.map(post => ({
            ...post,
            username: uidToUsername[post.UID] || 'Unknown',
        }));

        return res.json({ success: true, posts: postsWithUsername });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message });
    }
})

// Create new post and add in user 

router.post('/create', upload.single("dataFile"), async (req, res) => {

    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);
        const { UID, postTitle, postDescription, postType } = req.body;
        const tags = JSON.parse(req.body.tags);
        const dataFile = req.file;
        let postUrl;

        if (postType === "video") {
            const fileBuffer = fs.readFileSync(dataFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: dataFile.originalname,
                folder: "/videos",
                useUniqueFileName: true
            });


            postUrl = response.url;

        } else {
            const fileBuffer = dataFile.buffer;
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: dataFile.originalname,
                folder: "/images"
            })

            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            });
            postUrl = optimizedImageUrl;
        }

        if (postUrl) {

            console.log(postUrl)

            const response = await Post.create({ UID: UID, postTitle: postTitle, postDescription: postDescription, tags: tags, postUrl: postUrl, postType: postType });
            const addInUser = await User.findOneAndUpdate({ UID: UID }, { $push: { user_Posts: response.PID } }, { new: true })
            if (!addInUser) {
                return res.json({ success: false, message: "Invalid User" });
            }
            return res.json({ success: true, message: "Post successfully added", response, addInUser })

        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        
        const { id } = req.params;
        const post = await Post.findOne({ PID: id });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        const user = await User.findOne({ UID: post.UID });
        const username = user ? user.username : "unknown";

        const postWithUser = {
            ...post.toObject(), // convert mongoose doc to plain object
            username,
        };
        const comments = await Comment.find({ PID: post.PID });
        if (comments.length === 0) {
            return res.json({ success: true, message: "Post has no comments", post: postWithUser, comments: [] })
        }


        return res.json({ success: true, post: postWithUser, comments })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

})
// route to delete post 

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;   // Post ID
        const { UID } = req.body;    // User ID of the one deleting

        // 1️⃣ Find the post
        const post = await Post.findOne({ PID: id });
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // 2️⃣ Check if the user owns this post
        if (post.UID !== UID) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own posts" });
        }

        // 3️⃣ Delete post from Post collection
        await Post.deleteOne({ PID: id });

        // 4️⃣ Remove post reference from user's user_Posts array
        await User.findOneAndUpdate(
            { UID },
            { $pull: { user_Posts: id } },
            { new: true }
        );

        // 5️⃣ (Optional) Delete all comments for that post
        await Comment.deleteMany({ PID: id });

        // 6️⃣ Respond
        return res.json({
            success: true,
            message: "Post deleted successfully!",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});





// route to add or remove like from an post 

router.post('/like/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const { UID } = req.body;
        const post = await Post.findOne({ PID: id });
        const user = await User.findOne({ UID: UID });
        if (!post || !user) {
            return res.status(404).json({ success: false, message: "Post or user not found" })
        }

        if (user.liked_Posts.includes(post.PID)) {
            const updatedPost = await Post.findOneAndUpdate({ PID: post.PID }, { $inc: { likes: -1 } }, { new: true });
            const removeLikePostInUser = await User.findOneAndUpdate({ UID: user.UID }, { $pull: { liked_Posts: post.PID } }, { new: true });

            return res.json({
                success: true,
                message: "liked removed successfully!",
                post: updatedPost
            });
        }



        const updatedPost = await Post.findOneAndUpdate({ PID: post.PID }, { $inc: { likes: 1 } }, { new: true });
        const addLikePostInUser = await User.findOneAndUpdate({ UID: user.UID }, { $push: { liked_Posts: post.PID } }, { new: true })

        return res.json({
            success: true,
            message: "Post liked successfully!",
            post: updatedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})


export default router;