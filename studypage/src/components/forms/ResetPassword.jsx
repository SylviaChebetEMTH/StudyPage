import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import passwordReset from '../assets/passwordReset.mp4';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const validatePassword = (password) => {
    if (!password) return '';
    if (password.length < 8) return 'Too Short';
    if (/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(password)) return 'Strong';
    return 'Weak';
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(validatePassword(password));
  };

  const toggleShowPassword = () => {
    console.log("Toggling password visibility...");
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordStrength !== 'Strong') {
      setError('Password must be strong. Follow the guidelines below.');
      toast.error('Password must be strong. Follow the guidelines below.');
      return;
    }

    try {
      const response = await axios.post(`https://backendstudypage.onrender.com/reset_password/${token}`, {
        new_password: newPassword,
      });

      if (response.data.success) {
        toast.success('Password updated successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setError(response.data.error);
        toast.error(response.data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    }
  };
  const handleVideoEnd = (e) => {
    e.target.play(); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <video
              autoPlay
              loop
              muted
              className="absolute top-0 left-0 w-full h-full object-cover -z-10"
              onEnded={handleVideoEnd}
            >
              <source
                src={passwordReset}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
      <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-200 mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-200"
            >
              New Password
            </label>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full p-2  mb-4 mt-1 px-3 py-2 bg-gray-700 rounded-md sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500 "
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center cursor-pointer"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {passwordStrength && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength === 'Strong'
                  ? 'text-green-500'
                  : passwordStrength === 'Weak'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              Password Strength: {passwordStrength}
            </p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 mt-2 bg-yellow-400 hover:bg-yellow-500  text-gray-500 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Reset Password
          </button>
          <div className="mt-4 text-sm text-gray-300">
            <p>Password must be:</p>
            <ul className="list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Include at least one number</li>
              <li>Include at least one special character (e.g., !@#$%^&*)</li>
              <li>Include both letters and numbers</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
