import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    CID: {
            type: String,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toString()
        },
    PID : {
        type: String,
        required: true
    },
    UID : {
        type: String,
        required: true
    },
    comment:{
        required: true,
        type: String
    }
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;