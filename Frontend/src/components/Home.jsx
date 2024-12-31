import React, { useContext, useEffect } from 'react';
import Feed from './Feed';
import Friends from './Friends';
import { UserContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const {user}=useContext(UserContext)
    const token = localStorage.getItem('token')
     const navigate= useNavigate()
    useEffect(()=>{
      if(!user||!token){
        navigate('/login')
      }


    })
   
  return (
    <div className="w-full h-screen flex">
      <div className="w-3/5">
        <Feed />
      </div>
      <div className="w-2/5">
        <Friends />
      </div>
    </div>
  );
};

export default Home;
