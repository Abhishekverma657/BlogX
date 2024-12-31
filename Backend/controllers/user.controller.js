import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const registerUser = async (req, res) => {
  const { name, email, password, bio, username } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const generatedUsername = username || name.toLowerCase().replace(/\s+/g, "_");

    const newUser = new User({
      name,
      username: generatedUsername,
      email,
      password: hashedPassword,
      bio: bio || undefined,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
      token: token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username: email }], // Support login via email or username
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      message: "Welcome back!",
      user: user,
      token: token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const users = await User.find({ _id: { $ne: loggedInUserId } });

    res.status(200).json({
      message: "Users fetched successfully.",
      users: users,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export const followUser = async (req, res) => {
  const { userIdToFollow } = req.params;
  const currentUserId = req.user.id;

  try {
    const updatedUserToFollow = await User.findByIdAndUpdate(
      userIdToFollow,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    const updatedCurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userIdToFollow } },
      { new: true }
    );

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
    await User.findByIdAndUpdate(userIdToUnfollow, {
      $pull: { followers: currentUserId },
    });

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

  try {
    const user = await User.findById(userId).populate("followers", "name email username");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("following", "name email username");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMentions = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "mentions.post",
        populate: { path: "createdBy", select: "name email username" },
      })
      .populate("mentions.mentionedBy", "name email username");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ mentions: user.mentions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getMentionedPosts = async (req, res) => {
  try {
      const userId = req.user.id; // Current logged-in user ID

      // Fetch mentioned posts for the user
      const user = await userModel.findById(userId).populate({
          path: "MentionedPosts.postId",
          select: "title description userId",
          populate: { path: "userId", select: "name email" }, // Populate post creator details
      });

      if (!user || !user.MentionedPosts ) {
          return res.status(404).json({ message: "No mentioned posts found for this user." });
      }

      res.status(200).json({
          message: "Mentioned posts fetched successfully.",
          mentionedPosts: user.MentionedPosts,
      });
  } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
  }
};




    export const getSerchUsername= async (req, res) => {
  const { query } = req.query; // Frontend se search query aayegi
  try {
    const users = await userModel.find(
      { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
      '_id username'
    ).limit(10); // Max 10 suggestions
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching usernames' });
  }
};

