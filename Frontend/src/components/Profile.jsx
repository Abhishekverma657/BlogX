import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/AuthContext';
 import axios from 'axios';
 

const Profile = () => {
    const {user}= useContext(UserContext)
     console.log(user)
 
     const [userposts, setUserposts] = useState([])
   
  const [activeTab, setActiveTab] = useState('posts');
   useEffect(()=>{
    const getUserPosts=async()=>{
      const token= localStorage.getItem('token') 
      
    
      try{
        const res= await  axios.get(`${import.meta.env.VITE_BACKEND_URL}/post/get-user-post`,
        
          {
          headers:{
           
            Authorization: `Bearer ${token}`
            }
        })
         if(res.status===200){
          console.log(res.data)
          setUserposts(res.data.posts)
           

         }
          else{
            console.log('error')
          }

      } catch(e){
        console.log(e)
      }
    }
    getUserPosts()

   },[])
   // State to handle active tab

  return (
    <div className="flex flex-col items-center p-10 bg-gray-900  text-white  overflow-y-auto max-h-screen scrollbar-hide">
      {/* Avatar */}
      <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold text-white mb-4">
      {user.user.name ? user.user.name.charAt(0) : "U"}
      </div>

      {/* User Information */}
      <h1 className="text-2xl font-bold mb-1">{user.user.name}</h1>
      <p className="text-gray-400 mb-6">{user.user.bio}</p>

      {/* Followers and Following */}
      <div className="flex justify-between w-1/2 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{user.user.followers.length}</span>
          <span className="text-gray-400">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{user.user.following.length}</span>
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
              activeTab === 'liked' ? 'border-b-2 border-blue-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('liked')}
          >
            Liked Posts
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full flex flex-col items-center">
        {activeTab === 'posts' && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Your Posts</h2>
          
            {
              userposts.map((post , index)=>{
                return (
                  <div key={index} className="w-full mb-4 p-4 border border-gray
                  -700 rounded-md">
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    </div>
                )
              })
            }


            
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Liked Posts</h2>
            {/* Dummy liked posts */}
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p>Liked Post 1: This is a liked post!</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p>Liked Post 2: Another liked post!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
