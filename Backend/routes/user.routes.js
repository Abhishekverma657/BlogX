import express from 'express';
import { followUser, getAllUser, getFollowers, getFollowing, getProfile, loginUser, registerUser, unfollowUser } from '../controllers/user.controller.js';
import { authUser } from '../middelewere/auth.js';
  

const router = express.Router();

// Register route
router.post('/register', registerUser);
router.post('/login', loginUser)
router.get('/profile', authUser,  getProfile)
router.get('/all-users', authUser,getAllUser)
router.post('/follow-user/:userIdToFollow',authUser, followUser)
router.post('/unfollow-user/:userIdToUnfollow', authUser,unfollowUser)
router.get('/followers',authUser, getFollowers)
router.get('/following',authUser,getFollowing)

export default router;
