import express from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, checkFriendRequestStatus, getAllFriends, removeFriend, checkFriend, removeSentFriendRequest } from "../controllers/friendController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
//friends
router.post("/send", sendFriendRequest);
router.put("/accept/:requestId", acceptFriendRequest);
// router.delete("/deletemyrequests/:userId/:friendId", deleteFriendRequest);
router.delete("/remove/:receiverId", verifyToken, removeSentFriendRequest);
router.put("/reject/:requestId", rejectFriendRequest);
router.get("/requests/:userId", getFriendRequests);
router.get("/getFriends/:userId", getAllFriends);
router.delete("/:userId/friends/:friendId", removeFriend);
router.get("/:userId/friends/:friendId/check", checkFriend);
router.get("/status/:senderId/:receiverId", checkFriendRequestStatus);

export default router;
