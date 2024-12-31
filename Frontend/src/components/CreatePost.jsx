 


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = ({ addNewPost }) => {
  const [title, setTitle] = useState("");
  const [mentions, setMentions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showAiInput, setShowAiInput] = useState(false);

  const handleAIGenerate = async (e) => {
    e.preventDefault();
    setLoadingAI(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/generate`,
        { prompt: prompt }
      );
      const aiContent = res.data;
    // Response content
      setTitle(aiContent);
      setPrompt("");
    } catch (error) {
      console.error("AI Generation Failed:", error);
      toast.error("Failed to generate AI content");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleInput = async (e) => {
    const inputValue = e.target.value;
    setTitle(inputValue);

    // Check if '@' is typed
    const lastWord = inputValue.split(" ").pop(); // Get the last word
    if (lastWord.startsWith("@")) {
      const searchQuery = lastWord.slice(1); // Remove '@' from query
      setQuery(searchQuery);

      if (searchQuery) {
        // Fetch suggestions from backend
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/search-username?query=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        
          setSuggestions(res.data); // Update suggestions
        } catch (e) {
          console.error(e);
        }
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addMention = (user) => {
    const updatedTitle = title.replace(`@${query}`, `@${user.username} `);
    setTitle(updatedTitle);
    setMentions([...mentions, user._id]); // Add user ID to mentions
    setSuggestions([]); // Clear suggestions
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/create`,
        { title, mentions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        const newPost = res.data.post;
        addNewPost(newPost);
        setTitle("");
        setMentions([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleAiInput = (e) => {
    e.preventDefault();
    setShowAiInput(!showAiInput);
  };

  return (
    <div>
      <form className="w-full mt-5 bg-[#203345] rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-lg font-serif font-semibold p-3">
            Create a New Post
          </h1>
          <button
            onClick={toggleAiInput}
            className="bg-slate-600 border border-slate-400 p-2 shadow-lg rounded-full text-sm"
          >
            Generate Blog with AI
          </button>
        </div>
        {showAiInput && (
          <div className="transition-all duration-500 ease-in-out mt-5 transform relative m-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 resize-none"
              placeholder="Share your thoughts here..."
            ></input>
            <button
              onClick={handleAIGenerate}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 ${
                loadingAI
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              } text-white font-semibold rounded-r-lg text-sm`}
              disabled={loadingAI}
            >
              {loadingAI ? "Loading..." : "Generate"}
            </button>
          </div>
        )}

        <div className="relative m-3">
          <textarea
            value={title}
            onChange={handleInput}
            className="p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24 resize-none"
            rows="2"
            placeholder="Share your thoughts here..."
          ></textarea>
          {suggestions.length > 0 && (
            <div className="absolute bg-slate-400 border border-gray-300 rounded-lg shadow-lg w-full z-10">
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  className="p-2 cursor-pointer hover:bg-slate-800"
                  onClick={() => addMention(user)}
                >
                  @{user.username}
                </div>
              ))}
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              onClick={handlePost}
              className={`px-4 py-2 mb-1 ${
                isPosting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white font-semibold rounded-full text-sm transition duration-300 ease-in-out`}
              disabled={isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
