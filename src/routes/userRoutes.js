import express from "express";
import { getUser, getUserDetailById, getUsersFromSameCollege, login, logout, searchUsers, signupController, updateProfile } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { handleEmptyFile, upload } from "../middlewares/multer.js";

//user

const router = express.Router()
 router.post("/signup" , signupController)
 router.post("/login" , login)
 router.post("/logout" , logout)
 router.post("/updateProfile/:id" , verifyToken,upload.single("image"),handleEmptyFile ,updateProfile)
 router.get("/getuser" ,verifyToken, getUser)
 router.get("/searchuser/:query" , searchUsers)
 router.get("/otherUser/:id" , getUserDetailById)
 router.get("/:userId/same-college", getUsersFromSameCollege);

export default router;