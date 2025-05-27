import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title : {type:String , required : true , maxlength : 50 },
    content: { type: String, required: true, maxlength: 280 }, // Max 280 chars
    image : { type:String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the tweet
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array of comment IDs
    tags:[{type:String}]
},{timestamps:true});

const Post = mongoose.model('post', postSchema);

export default Post;
