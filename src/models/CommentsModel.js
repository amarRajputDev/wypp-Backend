import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // thought: { type: mongoose.Schema.Types.ObjectId, ref: "Thought", required: true },
  like:{type:Number , default:0}
},{timestamps:true});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

