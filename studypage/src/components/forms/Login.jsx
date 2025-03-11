import React, { useState, useContext } from "react";
// import axios from "axios";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import googleIcon from '../assets/googleIcon.png';
import loginImage from "../assets/login.png";
import loginVideo from '../assets/loginVideo.mp4';
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { setAuthToken, setCurrentUser } = useContext(UserContext);
  const { login, loading } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  console.log("setAuthToken:", setAuthToken);
  console.log("setCurrentUser :", setCurrentUser);

  // const handleGoogleSignup = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     try {
  //       const { access_token } = response;
  //       const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //         headers: { Authorization: `Bearer ${access_token}` },
  //       });

  //       // Prepare the user data from Google response
  //       const user = {
  //         email: data.email,
  //         username: data.given_name || data.email,
  //       };
  //       console.log("Before setting user:", user);

  //       // Send the user data to your backend to handle signup/login
  //       const res = await axios.post("https://studypage.onrender.com/auth/google", user);

  //       if (res.data.success) {
  //         // Check if the user is an existing user or a new user
  //         if (res.data.authToken) {
  //           // If the user has an auth token, they are an existing user
  //           setAuthToken(res.data.authToken); // Set the auth token in context
  //           setCurrentUser(res.data); // Set the current user in context
  //           localStorage.setItem('token', res.data.authToken);
  //           // alert("Logged in successfully!");

  //           // Save user data to localStorage or context for future use (authentication state)
  //           localStorage.setItem('user_id', res.data.user_id);
  //           localStorage.setItem('email', res.data.email);
  //           localStorage.setItem('username', res.data.username);
  //           localStorage.setItem('is_admin', res.data.is_admin);

  //           // Navigate user based on their role
  //           if (res.data.is_admin) {
  //             navigate("/admin/dashboard");
  //           } else {
  //             navigate("/");
  //           }
  //         } else {
  //           // If no auth token exists, it means the user is new
  //           toast.error("Check your email to set your password.");
  //         }
  //       } else {
  //         // Handle any other failure cases
  //         toast.error("An error occurred. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Google Signup failed:", error);
  //       toast.error("Google Signup failed. Please try again.");
  //     }
  //   },
  //   onError: () => console.error("Google Login Failed"),
  // });

  const handleNavigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    console.log("Loading state set to true");
  
    try {
      const user = await login(email, password);
      if (user) {
        // localStorage.setItem("isAdmin", user.is_admin);
        
        // Delay to ensure UI update before navigation
        await new Promise(resolve => setTimeout(resolve, 500));
  
        if (user.is_admin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      // setLoading(false);
      console.log("Loading state set to false");
    }
  };
  
  const handleGoHome = () => {
    navigate("/");
  };
  const handleVideoEnd = (e) => {
    e.target.play(); 
  };

  return (
    <div className="login-container">
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          onEnded={handleVideoEnd}
        >
          <source src={loginVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        {/* Login Card */}
        <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-lg md:h-[600px] flex flex-col md:flex-row">
          {/* Left Section - Login Form */}
          <div className="md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-6 md:p-8">
            {/* Back Button */}
            <button
              onClick={handleGoHome}
              className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-2 mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to website</span>
            </button>
  
            {/* Login Header */}
            <h2 className="text-3xl font-bold mb-6 text-center">Log in</h2>
  
            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-400">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  placeholder="Your Email"
                />
              </div>
  
              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  placeholder="Password"
                />
                {/* Show/Hide Password Icon */}
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>
  
              {/* Login Button */}
              <button
                type="button" // Prevents form submission interfering
                disabled={loading}
                onClick={handleSubmit}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition ${
                  loading ? "bg-yellow-500 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-white border-white/50 rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm mt-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox text-yellow-400" />
                  <span>Remember me</span>
                </label>
                <button
                  onClick={handleNavigateToForgotPassword}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
  
              {/* Divider */}
              <div className="mt-6 text-center text-gray-500">or</div>
  
              {/* Social Login */}
              {/* <button
                onClick={handleGoogleSignup}
                className="mt-4 flex items-center justify-center py-2 px-3 w-full border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition"
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
                Log in with Google
              </button> */}
  
              <div className="text-center mt-4 text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
  
          {/* Right Section - Image */}
          <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }} />
        </div>
      </div>
    </div>
  );
  
}