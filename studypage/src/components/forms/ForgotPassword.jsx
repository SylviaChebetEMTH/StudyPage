import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import passwordVideo from '../assets/passwordVideo.mp4';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://studypage-h2eu.onrender.com/auth/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("A reset link has been sent to your email.");
          toast.success("A reset link has been sent to your email!");
        } else {
          if (data.error === "User not found") {
            setMessage("User not found. Would you like to sign up?");
            toast.error("User not found. Please sign up.");
          } else {
            setMessage(data.error || "Failed to send reset link.");
            toast.error(data.error || "Failed to send reset link.");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      });
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };
  const handleVideoEnd = (e) => {
    e.target.play(); 
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        onEnded={handleVideoEnd}
      >
        <source
          src={passwordVideo}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 p-6 rounded shadow-md">
        <h1 className="text-2xl text-gray-300 font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Enter your email to reset your password:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full p-2 mb-4 mt-1 px-3 py-2 bg-gray-700 rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
            required
          />
          <button
            type="submit"
            className="py-2 px-4 mt-2 bg-yellow-400 hover:bg-yellow-500 text-gray-500 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}

        {message && message.includes("User not found") && (
          <button
            onClick={handleSignupRedirect}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Proceed to Signup
          </button>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
