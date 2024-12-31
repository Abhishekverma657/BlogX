import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation(); 
   const {setUser,setToken}=useContext(UserContext)
   const navigate=useNavigate()
  // Get the current route
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Clear user context
    setUser(null);
    setToken(null)
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="pl-10   h-full relative  ">
      {/* Home Link */}
       <div className=' h-14 w-full  flex  items-center gap-2 text-2xl '>
        <div className='h-12 w-12 rounded-full bg-white flex items-center  text-slate-800 justify-center font-bold text-3xl'>
          B
        </div>
         BlogX
       </div>
    
      <div
        className={`flex   gap-4 mt-4  font-serif ${
          location.pathname === '/' ? 'text-blue-500' : 'text-white'
        }`}
      >
        <i className="ri-home-4-line "></i>
        <Link to="/" className="hover:text-blue-300">
          Home
        </Link>
      </div>

      {/* Profile Link */}
      <div
        className={`flex gap-4 mt-4  font-serif ${
          location.pathname === '/profile' ? 'text-blue-500' : 'text-white'
        }`}
      >
        <i className="ri-user-3-fill "></i>
        <Link to="/profile" className="hover:text-blue-300">
          Profile
        </Link>
      </div>
      <div className="absolute bottom-8 left-4 flex items-center gap-2 text-white cursor-pointer hover:text-blue-300">
        <i className="ri-logout-circle-line text-2xl"></i>
        <button onClick={handleLogout} className="font-serif text-xl">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;
