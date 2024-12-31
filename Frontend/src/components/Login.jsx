import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/AuthContext';

const Login = () => {
  const { user, token, setUser, setToken } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const Subbmithandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const res = await axios.post('https://blogx-1ltm.onrender.com/api/user/login', {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        
        setUser(res.data);
        setToken(res.data.token);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));

        toast.success(res.data.message);
        navigate('/');
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

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
            className={`w-full py-2 items-center font-semibold rounded-lg transition duration-300 ease-in-out ${
              loading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-700 text-white'
            }`}
            disabled={loading} // Disable button during loading
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-50"></div>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
