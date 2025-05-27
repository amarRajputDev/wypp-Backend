import { FriendRequest } from "../models/friendRequestModel.js";
import User from "../models/UserModer.js";

export const sendFriendRequest = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      // console.log( "receiverId",receiverId)
  
      if (senderId === receiverId) {
        return res.status(400).json({ message: "You cannot send a request to yourself." });
      }
  
      const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
  
      if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent." });
      }
  
      const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId });
      
      res.status(201).json({ message: "Friend request sent!", request: newRequest });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  
  export const acceptFriendRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      
      console.log(`Incoming request to accept friend request: ${requestId}`);
      
      const request = await FriendRequest.findById(requestId);
      if (!request) {
        console.log("Friend request not found");
        return res.status(404).json({ message: "Request not found" });
      }
  
      console.log(`Found friend request:`, request);
  
      // Add friends
      const senderUpdate = await User.findByIdAndUpdate(
        request.sender, 
        { $addToSet: { friends: request.receiver } }, 
        { new: true } // Returns the updated document
      );
  
      const receiverUpdate = await User.findByIdAndUpdate(
        request.receiver, 
        { $addToSet: { friends: request.sender } }, 
        { new: true } 
      );
  
      if (!senderUpdate || !receiverUpdate) {
        console.log("Sender or Receiver not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Sender updated:", senderUpdate);
      console.log("Receiver updated:", receiverUpdate);
  
      // Delete the friend request after acceptance
      await FriendRequest.findByIdAndDelete(requestId);
      console.log("Friend request deleted successfully!");
  
      console.log("Friend request accepted successfully!");
      res.status(200).json({ message: "Friend request accepted!" });
  
    } catch (error) {
      console.error("Error in acceptFriendRequest:", error); // Log full error
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  
  export const rejectFriendRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      
      const request = await FriendRequest.findByIdAndRemove(requestId);
      console.log( request )
      if (!request) return res.status(404).json({ message: "Request not found" });
  
      res.status(200).json({ message: "Friend request rejected and deleted!" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };


 //controller to remove a friend request sended by me
//   const removeSentFriendRequest = async (req, res) => {
//     try {
//         const { receiverId } = req.params; // Get receiverId from request params
//         const senderId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID

//         // Find and delete the friend request
//         const deletedRequest = await FriendRequest.findOneAndDelete({ senderId, receiverId });

//         if (!deletedRequest) {
//             return res.status(404).json({ message: "Friend request not found" });
//         }

//         res.status(200).json({ message: "Friend request removed successfully" });
//     } catch (error) {
//         console.error("Error removing friend request:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
  

  export const getFriendRequests = async (req, res) => {
    try {
      const { userId } = req.params;

      // console.log(userId)
  
      const receivedRequests = await FriendRequest.find({ receiver: userId }).populate("sender" , "username profilePic _id");
      const sentRequests = await FriendRequest.find({ sender: userId }).populate("receiver" , "username profilePic _id");

  
      res.status(200).json({ receivedRequests, sentRequests });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const checkFriendRequestStatus = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
  
      const request = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
      });
  
      if (!request) {
        return res.status(200).json({ status: "none", message: "No friend request sent." });
      }
  
      res.status(200).json({ status: request.status, message: `Friend request ${request.status}.` });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const getAllFriends = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user and populate the friends field to get their details
      const user = await User.findById(userId).populate("friends", "fullName username email profilePic");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ friends: user.friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const removeFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      // Find the user and remove the friend from their friends list
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Also remove the user from the friend's friends list (optional for bi-directional friendship)
      await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });
  
      res.status(200).json({ message: "Friend removed successfully", friends: user.friends });
    } catch (error) {
      console.error("Error removing friend:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const checkFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      // Find the user and check if friendId exists in the friends array
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isFriend = user.friends.includes(friendId);
  
      res.status(200).json({ isFriend });
    } catch (error) {
      console.error("Error checking friendship:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


 export const removeSentFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params; // Get receiverId from request params
        const senderId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID

        console.log("Sender:", senderId);
        console.log("Receiver:", receiverId);
        // Find and delete the friend request
        const deletedRequest = await FriendRequest.findOneAndDelete({ sender:senderId, receiver:receiverId });
        // const find = await FriendRequest.findOne({sender:senderId , receiver:receiverId})
        console.log(deletedRequest)

        if (!deletedRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        res.status(200).json({ message: "Friend request removed successfully" });
    } catch (error) {
        console.error("Error removing friend request:", error);
        res.status(500).json({ message: "Server error" });
    }
};