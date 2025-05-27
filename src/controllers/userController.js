import User from '../models/UserModer.js';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import uploadOnCloudinary from '../config/cloudinary.js';
import {FriendRequest} from '../models/friendRequestModel.js';

// fullName: "",
//     username: "",
//     gender: "",
//     address: "",
//     age: "",
//     collegeName: "",
//     courseName: "",
//     courseDuration: "",
//     yearOfStudy: "",
//     personality: "",
//     interests: "",
//     email: "",
//     password: "",
//     confirmPassword: "",

export const signupController = async (req, res) => {
    const {fullName,username,gender,address,age,collegeName,courseName,courseDuration,yearOfStudy,personality,interests,email,password} = req.body
  try {
    console.log("start")
    if (!fullName || !username || !collegeName || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all the required fields' });     
    }


    const existingUser = await User.findOne({ username});
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    
    const isEmailExist = await User.findOne({ email});
    if (isEmailExist) {
      return res.status(400).json({ message: 'Email already exists' });
      
    }

    const interest = interests.split(",")

    // console.log(interest)
  
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const malePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const femalePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    
    const user = new User({
      fullName,
      username,
      gender,
      address,
      age,
      collegeName,
      Course : {
        duration :courseDuration,
        currentYear:yearOfStudy,
        courseName
      },
      personality,
      intrests:interest,
      email,
      password :hashedPassword,
      profilePic : gender == "male" ? malePic : femalePic
      
    })

    console.log("created")
    
    

    await user.save()
    console.log("saved")


    
    const userData = user.toObject();
    delete userData.password;
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

    res.status(201).json({ message: 'User created successfully', userData });
   
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' , error });
    console.log(error)
  }
};

export const login = async (req , res) =>{
  const {username , password} = req.body;

  try {

    const isUserExist = await User.findOne({username})
    // console.log(isUserExist)

    if (!isUserExist) {
      return res.status(401).json({message:"user not exist"})
    }

    console.log("1")
    const isPassMatched = await bcrypt.compare(password , isUserExist.password)
    console.log("2")

    if (!isPassMatched) {
      return res.status(401).json({message:"Wrong Password"})
    }

    const userData = isUserExist.toObject();
    delete userData.password;

    const token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' , maxAge: 7 * 24 * 60 * 60 * 1000,});

    res.status(201).json({message:"SUccessfull Logged In" , userData})
    

  } catch (error) {
    return res.status(500).json({message:"Server Error" , error})
    
  }
}


export const getUser = async(req , res) => {

  try {
    const userId = req.user.id
    console.log("userid ="+userId)

    const userData = await User.findById(userId).select("-password")

    res.status(200).json({message:"Data Fetch Successfully" , userData})


    
  } catch (error) {
    return res.status(500).json({message:"Something Went Wrong" , error})
  }
  
}


export const searchUsers = async (req, res) => {
  try {
    console.log("start")
      const { query } = req.params; // Extract search query from URL params

      if (!query) {
          return res.status(400).json({ message: "Query parameter is required" });
      }

      // Find users matching the search query in username or fullname (case-insensitive)
      const users = await User.find({
          $or: [
              { username: { $regex: query, $options: "i" } },
              { fullname: { $regex: query, $options: "i" } }
          ]
      })
      .limit(5) // Return only 5 results
      .select("_id username fullName email profilePic"); // Return specific fields

      res.status(200).json({ users });
  } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Server error" });
  }
};


export const logout = async (req, res) => {
  try {


    if (!req.cookies.token) {
      return res.status(400).json({ message: "No token found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });



    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};


export const getUserDetailById = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from URL params

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID
    const user = await User.findById(id)
      .select("-password"); // Return specific fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOtherUserDetailById = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from URL params

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find user by ID
    const user = await User.findById(id)
      .select("-password"); // Return specific fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting other user detail:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params; // Use req.user.id if authentication is implemented
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { Bio , username, fullName } = req.body;

    let url = null
    console.log(req.body)

    if (req.file.path !== undefined) {
       url = await uploadOnCloudinary(req.file.path) 
    }


    // Filter out null, undefined, or empty values
    const updateFields = {};
    if (Bio?.trim()) updateFields.Bio = Bio;
    if (url){ 
      updateFields.profilePic = url;
    }
    if (username?.trim()) updateFields.username = username;
    if (fullName?.trim()) updateFields.fullName = fullName;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update user data
    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// import User from "../models/User.js";
export const getUsersFromSameCollege = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;

    // Find the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users from the same college but exclude the current user and their friends
    const users = await User.find({
      collegeName: currentUser.collegeName,
      _id: { $nin: [userId, ...currentUser.friends] },
    })
      .limit(Number(limit) || 10)
      .select("_id username profilePic");

    // Check friend request status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendRequest = await FriendRequest.findOne({
          $or: [
            { sender: userId, receiver: user._id }, // Sent request
            { sender: user._id, receiver: userId }, // Received request
          ],
        });

        let requestStatus = "none"; // Default: no request
        if (friendRequest) {
          requestStatus = friendRequest.status; // Example: "pending" or "accepted"
        }

        return {
          ...user._doc, // Include user data
          requestStatus,
        };
      })
    );

    res.status(200).json({ success: true, users: usersWithStatus });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};



