import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";



export const createPost = async (req, res) => {
  try {
      const { title, description, mentions } = req.body; // `mentions` contains an array of user IDs
      if (!title) {
          return res.status(400).json({ message: "Title is required" });
      }

      const userId = req.user.id;
      const newPost = new postModel({
          title,
          description,
          userId,
          mentions: mentions || [],
      });

      await newPost.save();

      // Update the post creator's profile
      await userModel.findByIdAndUpdate(userId, { $push: { Post: newPost._id } });

      // Update mentioned users' profiles
      if (mentions && mentions.length > 0) {
          await userModel.updateMany(
              { _id: { $in: mentions } },
              { $push: { MentionedPosts: { postId: newPost._id, mentionedBy: userId } } }
          );
      }

      res.status(201).json({
          message: "Post created successfully",
          post: newPost,
      });
  } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
  }
};







 

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
      const { text } =   req.body; 
  
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
        comments: post.comments,
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

  //  export const getAllPosts=async(req, res)=>{
  //   try{
  //     const posts = await postModel
  //     .find()
  //     .populate({
  //       path: "userId",
  //       select: "name email", // Fetch name and email of post owner
  //     })
  //     .populate({
  //       path: "comments.userId",
  //       select: "name", // Fetch name of comment users
  //     });
  //       res.status(200).json({
  //           message: "All posts fetched successfully.",
  //           posts: posts,
  //           });



  //   }catch(e){
  //       console.error(e);
  //       res.status(500).json({ message: e.message });
  //   }
  //  }



  export const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate({
                path: "userId",
                select: "name email",
            })
            .populate({
                path: "mentions",
                select: "name email",
            })
            .populate({
                path: "comments.userId",
                select: "name",
            });

        res.status(200).json({
            message: "All posts fetched successfully",
            posts: posts,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params; // ID of the post to delete
    const userId = req.user.id; // ID of the authenticated user

    // Find the post
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    // Remove the post
    await postModel.findByIdAndDelete(postId);

    // Remove the post reference from the user's Post array
    await userModel.findByIdAndUpdate(userId, { $pull: { Post: postId } });

    // Remove the post from mentioned users' MentionedPosts array
    if (post.mentions && post.mentions.length > 0) {
      await userModel.updateMany(
        { _id: { $in: post.mentions } },
        { $pull: { MentionedPosts: { postId: postId } } }
      );
    }

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};
