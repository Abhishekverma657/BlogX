import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/AuthContext';

const Login = () => {
    const {user , token, setUser ,setToken}= useContext(UserContext)
     const [email, setEmail] = useState('')
   
    //   console.log(token)
      
     const [password, setPassword] = useState('')
      const navigate= useNavigate();
      useEffect(()=>{
        if(token){
            navigate('/')
            }
      })
       
       
      const Subbmithandler = async(e)=>{
        e.preventDefault()
      
        try{

        
        const res = await axios.post('http://localhost:7000/api/user/login', {
            email: email,
            password: password
            })
             if(res.status===200){
                console.log(res.data)
                setUser(res.data)

                   setToken(res.data.token);
               
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data));
                
                toast.success(res.data.message)
                  navigate('/')
             }
             else{
                console.log("error")
                toast.error(res.data.message)
             }
            } catch(e){
                console.log(e)
                toast.error(e.response.data.message)

            }

      }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
        <form>
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
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
                 onClick={Subbmithandler}
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-400 hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
