import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    UID: {
        type: String,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_Posts: [{ type: mongoose.Schema.Types.ObjectId ,ref: "Post", default: [] }],
    user_Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }],
    liked_Posts : [{ type: mongoose.Schema.Types.ObjectId ,ref: "Post", default: [] }]

});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;