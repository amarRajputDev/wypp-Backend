import express from "express"
import { getConversationMessages, getMessage, getOrCreateConversation, getReceiversList, sendMessage } from "../controllers/messageController.js"
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router()
//message

router.post("/sendMessage/:id" , verifyToken , sendMessage)
router.get("/getMessage/:id" , verifyToken , getMessage)
router.get("/contacts" , verifyToken , getReceiversList)
router.get("/conversation/:conversationId" , verifyToken , getConversationMessages)
router.post("/getOrCreateConversation/", getOrCreateConversation);

export default router