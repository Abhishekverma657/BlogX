import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const createPost=async(req , res)=>{
    try{
        const {title,description}=req.body;
        if(!title){
            return res.status(400).json({message:"Title is required"});
        }
        const userId=req.user.id
         console.log(userId)
      


        const newPost=await postModel({
            title,
            description,
            userId,

        })
        await newPost.save();
        // console.log(newPost._id)
        





         await userModel.findByIdAndUpdate(userId,{$push:{Post:newPost._id}})

        res.status(201).json({
            message:"Post created successfully",
            post:newPost

        });


    }catch(e){
        console.log(e)
        res.status(500).json({ message: e.message });


    }
}

 export const likePost=async(req, res)=>{
    try{
        const {postId}=req.params;
        const userId=req.user.id
        const post=await postModel.findById(postId)
        if(!post){
            return res.status(404).json({message:"Post not found"})
            }
             
    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
      
        post.likes.push(userId);
  
       
        post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      }
      await post.save();
      res.status(200).json({ message: "Post liked successfully" ,post});

    }catch(e){
        console.log(e)
        res.status(500).json({ message: e.message });
    }
 }
 export const dislikePost = async (req, res) => {
    try {
      const { postId } = req.params; // Post ID from URL
      const userId = req.user.id; // User ID from the token
  
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // If the user already disliked the post, remove the dislike
      if (post.dislikes.includes(userId)) {
        post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      } else {
        // Otherwise, add the user to the dislikes array
        post.dislikes.push(userId);
  
        // Remove the user from the likes array if they previously liked
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      }
  
      await post.save();
      res.status(200).json({ message: "Post disliked/undisliked successfully", post });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  };

  export const addComment = async (req, res) => {
    try {
      const { postId } = req.params; 
      const { text } = req.body; 
  
      if (!text) {
        return res.status(400).json({ message: "Comment text is required." });
      }
  
      
      const post = await postModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      
      const comment = {
        userId: req.user.id, 
        text,
      };
      post.comments.push(comment);
       
  
      
      await post.save();
      
  
  
      res.status(201).json({
        message: "Comment added successfully.",
        comments: updatedPost.comments,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  export const getUserPosts = async (req, res) => {
    try {
      const userId = req.user.id; 
  
 
      const user = await userModel
        .findById(userId)
        .populate({
          path: "Post", // Populate posts
          model: "post", // Model ka naam jo populate karna hai
          select: "title description likes dislikes comments", // Sirf necessary fields fetch karo
        });
  
      if (!user || !user.Post || user.Post.length === 0) {
        return res.status(404).json({ message: "No posts found for this user." });
      }
  
      res.status(200).json({
        message: "User's posts fetched successfully.",
        posts: user.Post, 
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  };

   export const getAllPosts=async(req, res)=>{
    try{
      const posts = await postModel
      .find()
      .populate({
        path: "userId",
        select: "name email", // Fetch name and email of post owner
      })
      .populate({
        path: "comments.userId",
        select: "name", // Fetch name of comment users
      });
        res.status(200).json({
            message: "All posts fetched successfully.",
            posts: posts,
            });



    }catch(e){
        console.error(e);
        res.status(500).json({ message: e.message });
    }
   }