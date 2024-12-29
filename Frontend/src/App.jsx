import React, { useContext } from 'react';
import { Router , Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation'; // Sidebar Navigation
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { UserContext } from './context/AuthContext';
import 'remixicon/fonts/remixicon.css'


const App = () => {
    const location = useLocation();
    //  const {user}= useContext(UserContext)
    //  const token= localStorage.getItem('token')





  

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
  return (
    
      <div className="h-screen  flex bg-gray-900 text-white">
           <ToastContainer />
        
        {
            isAuthRoute? <div className='w-0'>

            </div>:
        
        
       
        <div className="w-1/5  bg-gray-800">
          <Navigation />
        </div>
}

        {/* Main Content */}
        <div className={` ${isAuthRoute?" w-full":'w-4/5 '}  `}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            
          </Routes>
        </div>
      </div>

  );
};

export default App;
