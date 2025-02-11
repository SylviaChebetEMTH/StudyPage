import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import googleIcon from '../assets/googleIcon.png';
import loginImage from "../assets/login.png";
import loginVideo from '../assets/loginVideo.mp4';

export default function Login() {
  const { setAuthToken, setCurrentUser } = useContext(UserContext);
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  console.log("setAuthToken:", setAuthToken);
  console.log("setCurrentUser :", setCurrentUser);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        // Prepare the user data from Google response
        const user = {
          email: data.email,
          username: data.given_name || data.email,
        };
        console.log("Before setting user:", user);

        // Send the user data to your backend to handle signup/login
        const res = await axios.post("https://studypage.onrender.com/auth/google", user);

        if (res.data.success) {
          // Check if the user is an existing user or a new user
          if (res.data.authToken) {
            // If the user has an auth token, they are an existing user
            setAuthToken(res.data.authToken); // Set the auth token in context
            setCurrentUser(res.data); // Set the current user in context
            localStorage.setItem('token', res.data.authToken);
            // alert("Logged in successfully!");

            // Save user data to localStorage or context for future use (authentication state)
            localStorage.setItem('user_id', res.data.user_id);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('is_admin', res.data.is_admin);

            // Navigate user based on their role
            if (res.data.is_admin) {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
          } else {
            // If no auth token exists, it means the user is new
            alert("Check your email to set your password.");
          }
        } else {
          // Handle any other failure cases
          alert("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Google Signup failed:", error);
        alert("Google Signup failed. Please try again.");
      }
    },
    onError: () => console.error("Google Login Failed"),
  });

  const handleNavigateToForgotPassword = () => {
    navigate("/forgot-password");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user) {
        if (user.is_admin === true) {
          navigate("/admin/dashboard");
          localStorage.setItem('isAdmin', user.is_admin);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);

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
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        onEnded={handleVideoEnd}
      >
        <source
          src={loginVideo}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

        <div className="max-w-screen-lg w-full bg-white rounded-lg overflow-hidden shadow-md h-[550px] ">
          <div className="flex flex-col md:flex-row">
            {/* Right white half */}
            <div className="md:w-1/2 bg-gray-800 text-white flex justify-center items-center px-4 py-8 md:px-8">
              <div className="flex items-center justify-center md:h-full">
                <div className="w-full max-w-md">
                  <div className="text-center">
                    <button
                      onClick={handleGoHome}
                      className="flex flex-start px-2 py-2 hover:text-yellow-400 text-white font-thin rounded"
                    >
                      Back to website
                    </button>
                  </div>
                  <div className="bg-gray-800 overflow-hidden p-2">
                    <h2 className="text-3xl font-semibold mb-4 text-center">
                      Log in
                    </h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300 hover:underline"
                        >
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                          placeholder="Your Email"
                        />
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-300 hover:underline"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                          placeholder="Password"
                        />
                        <span
                          className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center cursor-pointer text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="btn-primary w-full py-2 px-4 mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded"
                        >
                          Log in
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-300"
                          >
                            Remember me
                          </label>
                        </div>
                        <div className="text-sm">
                          <button
                            onClick={handleNavigateToForgotPassword}
                            className="font-medium text-blue-500 hover:text-blue-400"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="mt-6 text-center">
                          <div className="text-gray-500">or</div>
                          <div className="flex items-center justify-center mt-4 space-x-4 ">
                            <button
                              onClick={handleGoogleSignup} className="flex items-center justify-center py-1 px-3 w-auto text-gray-300 rounded-md shadow-sm text-sm border border-gray-200">
                              <img src={googleIcon} alt="Google" className="w-6 h-6 mr-2" />
                              Log in with Google
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-sm text-gray-500">
                          Don't have an account?
                        </span>{" "}
                        <Link
                          to="/signup"
                          className="text-sm font-medium text-blue-500 hover:text-blue-400"
                        >
                          Sign up
                        </Link>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-cover bg-center md:w-1/2"
              style={{ backgroundImage: `url(${loginImage})` }}
            >
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

