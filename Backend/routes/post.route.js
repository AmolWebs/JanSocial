import express from 'express'
import fs from 'fs'
import imagekit from '../config/imagekit.js'
import multer from "multer";
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js'

const router = express.Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 }, });

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
            const fileBuffer = fs.readFileSync(dataFile.path)
            // Upload Image to Imagekit
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: dataFile.originalname,
                folder: "/images"
            })
            // optimization through imagekit URL transformation

            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' }, //Auto compression
                    { format: 'webp' }, // convert to modern format
                    { width: '1280' } // width resizing
                ]
            });
            postUrl = optimizedImageUrl;
        }

        if (postUrl) {

            console.log(postUrl)
            // return res.json({success: true, postUrl})
            // const { UID, postTitle, postDescription, tags, postType, postComments } = req.body;

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
        const user = await User.findOne({UID: post.UID});
        const username = user ? user.username : "unknown";

        const postWithUser = {
            ...post.toObject(), // convert mongoose doc to plain object
            username,
        };
        const comments = await Comment.find({ PID: post.PID });
        if (comments.length === 0) {
            return res.json({ success: true, message: "Post has no comments", post: postWithUser , comments: []})
        }


        return res.json({ success: true, post: postWithUser, comments })
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }

})

export default router;