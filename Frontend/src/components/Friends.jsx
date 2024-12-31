import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Friends = () => {
  const [friends, setfriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]); // List after filtering based on search
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setUser } = useContext(UserContext); // Added setUser for real-time updates
  const [loadingIds, setLoadingIds] = useState([]); // Array to track loading for specific users

  useEffect(() => {
    const getAllFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/all-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );
        if (res.status === 200) {
          setfriends(res.data.users);
          setFilteredFriends(res.data.users);
        } else {
          console.log('Error fetching users');
        }
      } catch (e) {
        console.error(e);
      }
    };
    getAllFriends();
  }, []);

  const handleFollow = async (userIdToFollow) => {
    const token = localStorage.getItem('token');
    setLoadingIds((prev) => [...prev, userIdToFollow]); // Add userId to loadingIds

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/follow-user/${userIdToFollow}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);

        // Update friends and user following list in state
        setfriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend._id === userIdToFollow
              ? { ...friend, isFollowed: true }
              : friend
          )
        );

        setUser((prevUser) => ({
          ...prevUser,
          user: {
            ...prevUser.user,
            following: [...prevUser.user.following, userIdToFollow],
          },
        }));
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to follow user.');
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userIdToFollow)); // Remove userId from loadingIds
    }
  };

  const handleUnFollow = async (userIdToUnFollow) => {
    const token = localStorage.getItem('token');
    setLoadingIds((prev) => [...prev, userIdToUnFollow]); // Add userId to loadingIds

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/unfollow-user/${userIdToUnFollow}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);

        // Update friends and user following list in state
        setfriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend._id === userIdToUnFollow
              ? { ...friend, isFollowed: false }
              : friend
          )
        );

        setUser((prevUser) => ({
          ...prevUser,
          user: {
            ...prevUser.user,
            following: prevUser.user.following.filter(
              (id) => id !== userIdToUnFollow
            ),
          },
        }));
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to unfollow user.');
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userIdToUnFollow)); // Remove userId from loadingIds
    }
  };

  // Filter users based on the search query
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  return (
    <div className="bg-gray-800 h-screen overflow-y-auto   scrollbar-hide">
      <div className="flex items-center justify-center mt-5">
        <h1 className="text-white text-2xl font-semibold">Users to Follow</h1>
      </div>
      <div className="flex justify-center mt-4">
        <input
          className="w-2/3 rounded-full p-3 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearch}
          type="text"
          placeholder="Search new friends"
        />
      </div>
      <div className="mt-6 mr-5 ml-5">
        {filteredFriends.map((friend) => {
          const isFollowed = user.user.following.includes(friend._id);
          const isLoading = loadingIds.includes(friend._id);  
          return (
            <div
              key={friend._id}
              className="bg-gray-700 p-3 rounded-lg shadow-md flex justify-between items-center mb-4 hover:shadow-xl transition-shadow"
            >       
              <div className="flex items-start gap-3">
                <i className="ri-user-3-fill text-blue-500 text-xl"></i>
               
                 <div>
                 <h2 className="text-lg font-medium text-white">{friend.name}</h2>
                 <div className="text-gray-400 text-sm">
                    {/* {isFollowed?friend.followers.length+1:friend.followers.length-1||0} */}
                  {friend.followers.length|| 0} Followers
              </div>
                 </div>
              </div>
              
              <button
                onClick={() =>
                  isFollowed
                    ? handleUnFollow(friend._id)
                    : handleFollow(friend._id)
                }
                className={`${
                  isLoading ? 'bg-gray-400' :  ` ${isFollowed?'bg-red-500':'bg-blue-500'} `
                } text-white px-4 py-1 rounded-full font-semibold transition-all duration-300 transform hover:scale-105`}
                disabled={isLoading}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;
