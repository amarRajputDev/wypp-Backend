import express from "express";
import { addComment, decreaseLikes, getAllPostsById, getFeedPosts, increaseLikes, myPosts, uploadPost } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.js";
import verifyToken from "../middlewares/verifyToken.js";


const uploadRouter = express.Router()

// uploads

uploadRouter.post("/post" ,verifyToken , upload.single("image") ,  uploadPost )
uploadRouter.get("/myPosts" ,verifyToken , myPosts )
uploadRouter.get("/incLike" ,verifyToken , increaseLikes )
uploadRouter.get("/Feed" ,verifyToken , getFeedPosts )
uploadRouter.get("/decLike" ,verifyToken , decreaseLikes )
uploadRouter.get("/postComment" ,verifyToken , addComment )
uploadRouter.get("/getPostsbyId/:userId"  , getAllPostsById )

export default uploadRouter