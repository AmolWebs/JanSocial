import express from 'express';
import Comment from "../models/comment.model.js";
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { PID, UID, comment } = req.body;
        const post_id = Post.findOne({ PID: PID });
        const user_id = User.findOne({ UID: UID });

        if (post_id && user_id) {
            const response = await Comment.create({ PID, UID, comment });
            await Post.findOneAndUpdate(
                { PID },
                { $push: { postComments: response.CID } },
                { new: true }
            );
            await User.findOneAndUpdate(
                { UID },
                { $push: { user_Comments: response.CID } },
                { new: true }
            )
            return res.json({ success: true, message: "Comment Added Successfully", response });
        }
        else {
            return res.status(500).json({ success: false, message: "Invalid PID or UID" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/remove', async (req, res) => {
    try {
        const { CID } = req.body;
        const isComment = await Comment.findOne({ CID });
        if (!isComment) {
            return res.status(500).json({ success: false, message: "Comment does'nt exists!" });
        }
        const commentsPost = await Post.findOne({ postComments: CID })
        const commentsUser = await User.findOne({ user_Comments: CID });
        if (!commentsPost || !commentsUser) {
            return res.status(500).json({ success: false, message: "Comment ID is not in user or post collection" })
        }
        await Post.updateOne({ PID: commentsPost.PID }, { $pull: { postComments: CID } });
        await User.updateOne({ UID: commentsUser.UID }, { $pull: { user_Comments: CID } });

        await Comment.deleteOne({ CID: CID });

        return res.json({ success: true, message: "Comment removed successfully" });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
});



export default router;