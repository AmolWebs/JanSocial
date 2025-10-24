import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    PID : {
        type: String,
        unique: true,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    UID: {
        type: String,
        required: true
    },
    postTitle: {
        type: String, 
        required: true
    },
    postDescription: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type:Number,
        default: 0
    },
    postUrl: {
        type: String,
        required: true
    },
    postType:{
        type:String,
        required: true
    },
    postComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }]

}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;