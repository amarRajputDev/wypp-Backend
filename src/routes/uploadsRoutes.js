import express from "express";
import { addComment, decreaseLikes, getAllComments, getAllPostsById, getFeedPosts, increaseLikes, myPosts, uploadPost } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.js";
import verifyToken from "../middlewares/verifyToken.js";


const uploadRouter = express.Router()

// uploads

uploadRouter.post("/post" ,verifyToken , upload.single("image") ,  uploadPost )
uploadRouter.get("/myPosts" ,verifyToken , myPosts )
uploadRouter.get("/incLike/:postId" ,verifyToken , increaseLikes )
uploadRouter.get("/Feed" ,verifyToken , getFeedPosts )
uploadRouter.get("/decLike/:postId" ,verifyToken , decreaseLikes )
uploadRouter.post("/postComment/:postId" ,verifyToken , addComment )
uploadRouter.get("/getComment/:postId" ,verifyToken , getAllComments )
uploadRouter.get("/getPostsbyId/:userId"  , getAllPostsById )

export default uploadRouter