import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreatePost = ({addNewPost}) => {
    const [title, setTitle] =  useState('')
     const handlePost=async(e)=>{
        e.preventDefault();
        const token=localStorage.getItem('token')
        
        try{
             const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/post/create`,{
                title:title
             },{
                headers:{
                 
                    'Authorization': `Bearer ${token}`
                    }
             })
              if(res.status===201){
                console.log(res.data)
                const newPost = res.data.post; 
                 console.log(newPost)
                 
                addNewPost(newPost);  
              
                setTitle('')
              }
               else{
                console.log('error')
               }

        }
        catch(e){
            console.log(e)

        }
     }

  return (
    <div>
      <form className="w-full mt-5 bg-[#203345] rounded-lg shadow-lg">
        <h1 className="text-white text-lg  font-serif font-semibold p-3">Create a New Post</h1>
        {/* Description Field */}
        <div className="relative m-3">
          <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
            className="p-3  bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24 resize-none"
            rows="2"
            placeholder="Share your thoughts here..."
          ></textarea>
          {/* Buttons inside textarea */}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
             onClick={(e)=>handlePost(e)}
              className="px-4 py-2 mb-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-full text-sm transition duration-300 ease-in-out"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
