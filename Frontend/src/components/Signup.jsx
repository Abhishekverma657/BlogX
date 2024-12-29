import React, { useContext, useEffect, useState } from 'react';
import axios  from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/AuthContext';

const Signup = () => {
    const {user, setUser , token ,setToken}=useContext(UserContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate=useNavigate()
      useEffect(()=>{
            if(token){
                navigate('/')
                }
          })
     const subbmithandler = async(e)=>{
        e.preventDefault()
        // console.log(name,email,password)
        console.log(user)
        try{
             const res=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`,{
                name:name,
                email:email,
                password:password
             })
             if(res.status===201){
                console.log(res.data)
                setUser(res.data);
                setToken(res.data.token);
               
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data));
                toast.success(res.data.message)

                
                navigate('/')

             }
              else{
                   toast.error(res.data.message)
              }
           
            
        }catch(e){
            console.log(e)
               toast.error(e.response.data.message)
        }
     }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Sign Up</h2>
        <form>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Signup Button */}
          <button
           onClick={subbmithandler}
            type="submit"
            className="w-full py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-gray-300 text-sm mt-4 text-center">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-green-400 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
