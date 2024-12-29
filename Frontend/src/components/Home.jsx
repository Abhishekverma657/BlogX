import React, { useContext } from 'react';
import Feed from './Feed';
import Friends from './Friends';
import { UserContext } from '../context/AuthContext';

const Home = () => {
    const {user}=useContext(UserContext)
    //  console.log(" home screen pe  ", user)
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
