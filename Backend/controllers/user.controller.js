import bcrypt from  'bcrypt'
 import User from '../models/user.model.js'
 import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
 export  const registerUser=async(req, res)=>{
     const {name , email, password, bio}=req.body;
     try{
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
          }
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
          }
            // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        bio: bio || undefined,  
      });


       await newUser.save();

      //  crete token 
      const token = jwt.sign({ id: newUser._id},process.env.JWT_SECRET,
         { expiresIn: '24h' }

      )




       res.status(201).json({
        message: "User registered successfully.",
        user:  newUser,
        token: token
      });
  
         
     }catch(e){
        console.error(e);
        res.status(500).json({ message: "Internal server error." });

     }


 }
  export const loginUser=async(req,res)=>{
    try{
      const {email,password}=req.body;
      const user=await User.findOne({email});
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      const isMatch=await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.status(401).json({message:"Invalid  email or password"});
        }
        const token = jwt.sign({ id: user._id},process.env.JWT_SECRET,
          { expiresIn: '24h' });
          res.status(200).json({
            message: "Welcome back ",
            user: user,
            token: token


            
          })
              

    }catch(e){
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  }



 export const getProfile= async(req, res)=>{
  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      user:user
      });

  }catch(e){
    console.error(e);
    res.status(500).json({ message: "Internal server error." });
  }
 }

 export const getAllUser= async(req, res)=>{
  try{
     const loggedInUserId = req.user.id;
    const users = await userModel.find({ _id: { $ne: loggedInUserId } });
      
      res.status(200).json({
        message:"Users fetch succesfully",
        users:users
      });
  }catch(e){
    console.error(e);
    res.status(500).json({message:e.message})
  }
 }
 export const followUser = async (req, res) => {
  const { userIdToFollow } = req.params; // User to be followed
  const currentUserId = req.user.id; // Current logged-in user

  try {
     
    console.log(userIdToFollow  )
  const updatedUserToFollow = await userModel.findByIdAndUpdate(userIdToFollow, {
    $addToSet: { followers: currentUserId },
  }, { new: true });
 

  const updatedCurrentUser = await userModel.findByIdAndUpdate(currentUserId, {
    $addToSet: { following: userIdToFollow },
  }, { new: true });
 


  if (!updatedUserToFollow || !updatedCurrentUser) {
    return res.status(400).json({ message: "Follow operation failed." });
  }


    res.status(200).json({ message: "Followed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.params;
  const currentUserId = req.user.id;

  try {
    // Remove current user from the followers list of the user to unfollow
    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId },
    });

    // Remove user to unfollow from the current user's following list
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userIdToUnfollow },
    });

    res.status(200).json({ message: "Unfollowed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
 
  const userId = req.user.id;
  console.log(userId)

  try {
    const user = await userModel.findById(userId).populate("followers", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  const  userId  = req.user.id;

  try {
    const user = await userModel.findById(userId).populate("following", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// implement logout 






 
