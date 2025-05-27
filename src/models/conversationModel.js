import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    message : [{ type: mongoose.Schema.Types.ObjectId, ref: "Message", }],
  
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User",  }], 
    
    
},{timestamps:true});

const  Conversation = mongoose.model('conversation', conversationSchema);

export default Conversation ;
