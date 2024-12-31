import { Router } from "express";
import { addComment, createPost, deletePost, dislikePost, getAllPosts, getUserPosts, likePost } from "../controllers/postController.js";
import { authUser } from "../middelewere/auth.js";

 const router =Router();

  router.post("/create",authUser,createPost)
  router.patch('/like/:postId', authUser, likePost);

  
  router.patch('/dislike/:postId', authUser, dislikePost);
  router.post('/comment/:postId', authUser,addComment)
  router.get("/get-user-post", authUser,getUserPosts)
  router.get("/get-all-post",getAllPosts)
  router.delete('/delete-post/:postId', authUser, deletePost)

  export default router
