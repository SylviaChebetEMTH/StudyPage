import React, { useState, useContext } from 'react';
import axios from "axios";
import { UserContext } from '../contexts/userContext';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import googleIcon from '../assets/googleIcon.png';
import signupImage from '../assets/signup.png';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import loginVideo from '../assets/loginVideo.mp4';




export default function SignUp() {
  const { signup } = useContext(UserContext);
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;
        const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        // Use data from Google to register/login
        const user = {
          email: data.email,
          username: data.given_name || data.email,
        };

        // Send the user data to your backend to handle signup/login
        const res = await axios.post("http://127.0.0.1:5000/auth/google", user);
        alert("Check your email to set your password.");
        if (res.data.is_admin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Google Signup failed:", error);
        alert('Google Signup failed. Please try again.');
      }
    },
    onError: () => console.error("Google Login Failed"),
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(password)) {
      setError('Password must be at least 8 characters long and include numbers and symbols');
      return;
    }
    // if (!isValidPhoneNumber(phone_number)) {
    //   setError('Invalid phone number');
    //   return;
    // }

    try {
      await signup(username, email, phone_number, password);
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Something went wrong');
    }
  };
  const handleGoHome = () => {
    navigate("/");
  };
  const handleVideoEnd = (e) => {
    e.target.play(); // restart video on end
  };


  return (
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
        />
        Your browser does not support the video tag.
      </video>
      <div className="w-full max-w-screen-lg bg-customBlue rounded-lg overflow-hidden shadow-md">
        <div className="flex flex-col md:flex-row">
          {/* Left half with image */}
          <div
            className="bg-cover bg-center md:w-1/2"
            style={{ backgroundImage: `url(${signupImage})` }}
          >
          </div>

          {/* Right half with form */}
          <div className="md:w-1/2 px-4 py-8 md:px-12 bg-gray-800">
            <div className="flex items-center justify-center md:h-full">
              <div className="w-full max-w-md">
                <div className="text-center">
                  <button
                    onClick={handleGoHome}
                    className="mt-4 px-4 py-2 hover:text-yellow-400 font-thin text-white rounded"
                  >
                    Back to website
                  </button>
                </div>
                <div className="bg-customBlue overflow-hidden p-2">
                  <h2 className="text-3xl font-semibold mb-1 text-center text-gray-300">Create an account</h2>
                  <div className="text-center mb-2">
                    <span className="text-sm text-gray-500">Already have an account?</span>{' '}
                    <Link to="/login" className="text-sm font-medium text-blue-500 hover:text-blue-400">
                      Sign in
                    </Link>
                  </div>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {/* <div className="grid grid-cols-2 gap-4"> */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 hover:underline">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        placeholder="johndoe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 hover:underline">
                        Phone Number
                      </label>
                     
                      <PhoneInput
                        country={"us"}
                        value={phone_number}
                        onChange={(value) => setPhoneNumber(value)} 
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                        containerClass="mt-1"
                        inputClass="px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                      />

                    </div>
                    {/* </div> */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 hover:underline">
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
                        className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 hover:underline">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        placeholder="Password"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </span>
                    </div>
                    <div className="relative">
                      <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-300 hover:underline">
                        Repeat Password
                      </label>
                      <input
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        placeholder="Repeat Password"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center cursor-pointer"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        <FontAwesomeIcon icon={showPasswordConfirmation ? faEyeSlash : faEye} />
                      </span>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full py-2 px-4 mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Sign up
                      </button>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="text-gray-500">or</div>
                      <div className="flex items-center justify-center mt-4 space-x-4 ">
                        <button
                          onClick={handleGoogleSignup} className="flex items-center justify-center py-1 px-3 w-auto text-gray-300 rounded-md shadow-sm text-sm border border-gray-200">
                          <img src={googleIcon} alt="Google" className="w-6 h-6 mr-2" />
                          Sign up with Google
                        </button>
                      </div>
                    </div>

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
