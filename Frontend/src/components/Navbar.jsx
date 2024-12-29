import React from 'react';
 

const Navbar = () => {
  return (
    <div className="navbar flex items-center justify-between px-10 py-3  ">
    
      
    
      <div className=" flex items-center justify-center gap-6 font-semibold text-gray-300">
        <a href="#home" className="nav-item ">Home</a>
        <a href="#about" className="nav-item">About</a>
        <a href="#contact" className="nav-item">Contact</a>
        
      </div>
      <div className="flex items-center justify-center h-10 w-10 bg-red-50 rounded-full">
        <i className="ri-user-fill text-gray-800 text-2xl"></i>
      </div>
    </div>
  );
};

export default Navbar;
