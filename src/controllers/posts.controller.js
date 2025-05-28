import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/UserModer.js";


export const uploadPost = async (req , res) =>{
   try {
    const {title , description , tags} = req.body
    const userId = req.user.id

    console.log(req.file)

    const tagsarray = tags?.split(",")

    if (!title || !description) {
        res.status(400).json({message:"Title and descriptions are required"})
    }

    console.log(req.file.path)

    let url = await uploadOnCloudinary(req.file.path) 
    console.log("url" , url)

    const post = new Post({
        title,
        content : description,
        image: url,
        user: userId,
        tags: tagsarray
    })

    post.save()

    const postData = post.toObject()
    
    

    res.status(201).json({message : "post uploades" , postData })

    
   } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error });
   }
}

export const myPosts = async (req , res)=>{

    const userId = req.user.id

    try {
        const posts = await Post.find({ user: userId })
        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }
        res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts", error });
    }
}

export const increaseLikes = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userId = req.user.id;
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: "Like increased successfully" });
    } catch (error) {
        console.error("Error increasing likes:", error);
        res.status(500).json({ message: "Failed to increase likes", error });
    }
}

export const decreaseLikes = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userId = req.user.id;
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "You have not liked this post" });
        }
        post.likes.splice(index, 1);
        await post.save();
        res.status(200).json({ message: "Like decreased successfully" });
    } catch (error) {
        console.error("Error decreasing likes:", error);
        res.status(500).json({ message: "Failed to decrease likes", error });
    }
}
 

export const addComment = async (req, res) => {
    const postId = req.params.postId;
    const { comment } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userId = req.user.id;
        const newComment = { user: userId, text: comment };
        post.comments.push(newComment);
        await post.save();
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment", error });
    }
}

export const deleteComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.remove();
        await post.save();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Failed to delete comment", error });
    }
}

export const getAllComments = async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId).populate('comments.user', '_id username');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ comments: post.comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Failed to fetch comments", error });
    }
}

export const getAllPostsById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const posts = await Post.find({ user: userId });
        if (!posts) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts by user id:", error);
        res.status(500).json({ message: "Failed to fetch posts", error });
    }
}


export const getFeedPosts = async (req, res) => {
    try {
        const  userId  = req.user.id;

        console.log( "User ",userId)

        // Fetch the user
        const user = await User.findById(userId).populate("friends");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user's friends and college
        const friendIds = user.friends.map(friend => friend?._id.toString());
        const userCollege = user.collegeName; // Assuming the user schema has a 'college' field

        // Fetch all posts Populate Comments
        let posts = await Post.find().populate("user" , "username profilePic _id")

        // console.log("posts" , posts)

        // Scoring function for sorting posts
        posts = posts.map(post => {
            let score = 0;
            // console.log( "post data" ,post)
            if (!post.user) {
               return 
            }
            const postUserId = post.user.toString();


            // 1. Prioritize friend's posts (if the user has friends)
            if (friendIds.length > 0 && friendIds.includes(postUserId)) {
                score += 50;
            }

            // 2. If the user has no friends, prioritize posts from the same college
            if (friendIds.length === 0 && post.user.college === userCollege) {
                score += 40;
            }

            // 3. More likes = higher priority
            score += post.likes.length * 5;

            // 4. More comments = higher priority
            score += post.comments.length * 3;

            // 5. Newer posts get priority (recent posts within last 48 hours)
            const timeDiff = (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60); // in hours
            if (timeDiff < 48) {
                score += 20 - timeDiff; // The newer the post, the higher the boost
            }

            return { ...post.toObject(), score }; // Convert Mongoose doc to plain object
        });

        // Sort posts based on score in descending order
        posts.sort((a, b) => b.score - a.score);

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching feed posts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



