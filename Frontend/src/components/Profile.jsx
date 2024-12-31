import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

 

 

const Profile = () => {
  const { user } = useContext(UserContext);
   
  

  const [userposts, setUserposts] = useState([]);
  const [mentionPosts, setmentionPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const token = localStorage.getItem('token')
  const navigate= useNavigate()
   useEffect(()=>{
    if(!user||!token){
      navigate('/login')
    }
   })
       

  useEffect(() => {
    const token = localStorage.getItem('token');
    

    const getUserPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/get-user-post`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
         
          setUserposts(res.data.posts);
        } else {
          console.log('Error fetching user posts');
        }
      } catch (e) {
        console.log(e);
      }
    };

    const getmentionPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-mentioned-post`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          
          setmentionPosts(res.data.mentionedPosts);
        } else {
         
        }
      } catch (e) {
        console.log(e);
      }
    };

    getUserPosts();
    getmentionPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/post/delete-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        toast.success('Post deleted successfully!');
        setUserposts(userposts.filter((post) => post._id !== postId));
      } else {
        toast.error('Failed to delete the post.');
        
      }
    } catch (e) {
      console.log(e);
      toast.error('An error occurred while deleting the post.');
    }
  };
   

  return (
    <div className="flex flex-col items-center p-10 bg-gray-900 text-white overflow-y-auto max-h-screen scrollbar-hide">
      {/* Avatar */}
      <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-white mb-4">
        {user?.user.name ? user?.user.name.charAt(0) : 'U'}
      </div>

      {/* User Information */}
      <h1 className="text-2xl font-bold mb-1">{user?.user.name}</h1>
      <p className="text-gray-400 mb-6">{user?.user.bio}</p>

      {/* Followers and Following */}
      <div className="flex justify-between w-1/2 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{user?.user.followers.length}</span>
          <span className="text-gray-400">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{user?.user.following.length}</span>
          <span className="text-gray-400">Following</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="w-full border-b border-gray-700 mb-4">
        <div className="flex justify-center gap-10">
          <button
            className={`px-4 py-2 ${
              activeTab === 'posts' ? 'border-b-2 border-blue-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'Mention Posts' ? 'border-b-2 border-blue-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('Mention Posts')}
          >
            Mention Posts
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full flex flex-col items-center">
        {activeTab === 'posts' && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Your Posts</h2>
            {userposts.map((post, index) => (
              <div
                key={index}
                className="w-full mb-4 p-4 border border-gray-700 flex items-center justify-between rounded-md"
              >
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                <i
                  onClick={() => handleDeletePost(post._id)}
                  className="ri-delete-bin-line text-red-700 cursor-pointer"
                ></i>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Mention Posts' && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Mention Posts</h2>
            {mentionPosts.map((post, index) => (
              <div
                key={index}
                className="w-full mb-4 p-4 border border-gray-700 rounded-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold mb-2">{post.postId.title}</h3>
                  <p className="text-blue-700">~ @{post.postId.userId.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
