import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import {getReceiverSocketId, io} from "../index.js"
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || !receiverId) {
      return res.status(400).json({ message: "Receiver ID and message are required." });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot send message to yourself." });
    }

    console.log("Sender ID:", senderId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        message: []
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    conversation.message.push(newMessage._id);
    await conversation.save();

    // Socket.IO logic
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      message: "Message sent successfully",
      newMessage
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getMessage = async(req,res) =>{
   try {
    const recieverId = req.params.id
    const senderId = req.user.id

    const conversation = await Conversation.findOne({
        participants:{$all:[senderId , recieverId]}
    }).populate("message")

    console.log(conversation)
    res.status(200).json({conversation})
    
   } catch (error) {
    console.log(error)
   }
}

export const getReceiversList = async (req, res) => {
    try {
        const userId = req.user.id; // Get logged-in user ID

        // Find all conversations where the user is a participant
        const conversations = await Conversation.find({ participants: userId })
            .populate("participants", "fullname username profilePic") // Get receiver details
            .lean(); // Convert Mongoose docs to plain objects

        // Process receivers and fetch last message for each
        const receivers = await Promise.all(
            conversations.map(async (conv) => {
                // Exclude the logged-in user from participants
                const receiver = conv.participants.find(participant => participant._id.toString() !== userId);

                if (!receiver) return null; // Edge case handling

                // Fetch the last message exchanged between user and receiver
                const lastMessage = await Message.findOne({
                    $or: [
                        { senderId: userId, receiverId: receiver._id },
                        { senderId: receiver._id, receiverId: userId }
                    ]
                })
                    .sort({ createdAt: -1 }) // Sort by latest message
                    .select("message isSeen senderId createdAt") // Select only necessary fields
                    .lean();

                return {
                    conversationId: conv._id, // Include conversation ID
                    _id: receiver._id,
                    fullname: receiver.fullname,
                    username: receiver.username,
                    profilePic: receiver.profilePic,
                    lastMessage: lastMessage || null,
                };
            })
        );

        // Filter out null values
        res.status(200).json({ receivers: receivers.filter(r => r !== null) });
    } catch (error) {
        console.error("Error fetching receivers:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Get messages and participant details from a conversation
export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Find conversation and populate participants and messages
        const conversation = await Conversation.findById(conversationId)
            .populate("participants", "fullname username profilePic") // Get sender & receiver details
            .populate({
                path: "message",
                select: "message senderId createdAt isSeen", // Fetch necessary fields only
                options: { sort: { createdAt: 1 } }, // Sort from oldest to newest
            })
            .lean();

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Extract sender and receiver
        if (conversation.participants.length !== 2) {
            return res.status(400).json({ message: "Invalid conversation participants" });
        }

        const [participant1, participant2] = conversation.participants;
        const userId = req.user.id; // Assuming req.user is available via authentication middleware

        const sender = participant1._id.toString() === userId ? participant1 : participant2;
        const receiver = participant1._id.toString() === userId ? participant2 : participant1;

        res.status(200).json({
            conversationId,
            sender: {
                _id: sender._id,
                fullname: sender.fullname,
                username: sender.username,
                profilePic: sender.profilePic,
            },
            receiver: {
                _id: receiver._id,
                fullname: receiver.fullname,
                username: receiver.username,
                profilePic: receiver.profilePic,
            },
            messages: conversation.message, // Already populated messages
        });
    } catch (error) {
        console.error("Error fetching conversation messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// import Conversation from "../models/Conversation.js";

export const getOrCreateConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender and Receiver IDs are required" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Sender and Receiver cannot be the same" });
    }

    const participants = [senderId, receiverId].sort();

    const conversation = await Conversation.findOneAndUpdate(
      { participants },
      { $setOnInsert: { participants } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      conversationId: conversation._id,
      message: "Conversation fetched or created successfully",
    });
  } catch (error) {
    console.error("Error fetching/creating conversation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

