import React, { useContext, useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import axios from "axios";
import { UserContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";


const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

 
  const [commentInput, setCommentInput] = useState(''); // To manage comment input per post
  const [activePostId, setActivePostId] = useState(null); // To toggle comment sections

  // Fetch all posts
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/get-all-post`);
        if (res.status === 200) {
             
          setPosts(res.data.posts.reverse());
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    getAllPosts();
  }, []);


   const handleLike=async(postId)=>{
    try{
        const token=localStorage.getItem('token')
        if (!token) {
            console.error("No token provided");
            return; // Return if the token is not available
          }

          const post = posts.find((p) => p._id === postId);
          if (post.dislikes.includes(user.user._id)) {
            toast.error("You can't like and dislike a post at the same time.");
            return; // Prevent liking if user has already disliked
          }



        const res=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/post/like/${postId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                  },

        })
         if(res.status===200){
            
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        likes: res.data.post.likes, // Directly update with backend response
                      }
                    : post
                )
              );
             
         }
    }
    catch(error){console.error("Error liking post:", error.message);}
   }


   /// habdle dislike 

   const handleDisLike=async(postId)=>{
    try{
        const token=localStorage.getItem('token')
        if (!token) {
            console.error("No token provided");
            return; // Return if the token is not available
          }
          const post = posts.find((p) => p._id === postId);
          if (post.likes.includes(user.user._id)) {
            toast.error("You can't like and dislike a post at the same time.");
            return; // Prevent disliking if user has already liked
          }
        const res=await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/post/dislike/${postId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                  },

        })
         if(res.status===200){
            
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        dislikes: res.data.post.dislikes, // Directly update with backend response
                      }
                    : post
                )
              );
             
         }
    }
    catch(error){console.error("Error disliking post:", error.message);}
   }







  // Handle adding a comment
  const handleAddComment = async (postId) => {
     
    const token=localStorage.getItem('token')
    if (!token) {
        console.error("No token provided");
        return; // Return if the token is not available
      }
    // Get comment for the specific post
    if (!commentInput) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/post/comment/${postId}`,
        {
            text:commentInput
          },
        {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
              },

        }
        
       
      );
      if (res.status === 201) {
        
       
         toast.success(res.data.message)
         setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, comments: [...post.comments, ...res.data.comments] }
                : post
            )
          );
         setCommentInput(''); // Clear the comment input field

 
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  // Toggle comment section visibility
  const toggleCommentSection = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const formatDateTime = (isoDate) => {
    return format(new Date(isoDate), " MMMM dd, yyyy, hh:mm a");
  };
  const addNewPost = (newPost) => {
   
    setPosts((prevPosts) =>  [  newPost,...prevPosts ]); // Add new post to the top
  };

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide ml-3 mr-3">
      {/* Create Post */}
      <CreatePost addNewPost={addNewPost} /> 

      {/* Posts Feed */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="mt-5 p-4 bg-slate-800 text-white shadow-md rounded-lg w-full"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white font-sans">
                 {post.userId.name ? post.userId.name.charAt(0) : "U"}
              </div>
              <h2 className="font-semibold">{post.userId.name}</h2>
            </div>

            {/* Post Content */}
            <div className="mt-3">
            <h3 className="text-xl font-serif text-blue-200">
  {post.title.split(/(\@\w+)/).map((part, index) =>
    part.startsWith('@') ? (
      <span key={index} className="text-blue-500 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  )}
</h3>
            
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-600 mt-3">
              <div className="flex items-center gap-3">
                {/* Likes, Dislikes, Comments */}
                <div onClick={()=> handleLike(post._id)} 
                 className="flex items-center gap-1">
                  <i className={`ri-heart-line text-lg ${post.likes.includes(user.user._id)?'text-blue-400':''}`}></i>
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div 
                 onClick={()=>handleDisLike(post._id)}
                className="flex items-center gap-1">
                  <i className={`ri-dislike-line text-lg ${post.dislikes.includes(user.user._id)?'text-red-400':''} `}></i>
                  <span>{post.dislikes?.length || 0}</span>
                </div>
                 
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => toggleCommentSection(post._id)}
                >
                  <i className="ri-chat-1-line text-lg"></i>
                  <span>{post.comments?.length || 0}</span>
                </div>
               
              </div>
              <div className=" text-sm">{formatDateTime(post.createdAt)}</div>
            </div>

            {/* Comments Section */}
            {activePostId === post._id && (
              <div className="mt-4 bg-slate-900 p-3 rounded-lg">
                {/* Existing Comments */}
                <div className="max-h-40 overflow-y-auto">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <div key={index} className="text-gray-300 mt-2">
                        <strong>{comment.userId?.name || "Anonymous"}:</strong> {comment.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>

                {/* Add Comment Form */}
                <div className="flex items-center mt-4">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) =>
                     setCommentInput(e.target.value)
                    }
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-5">No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
