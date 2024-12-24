import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
      const response = await axios.post(`http://127.0.0.1:5000/reset_password/${token}`, {
        new_password: newPassword,
      });

      if (response.data.success) {
        toast.success('Password updated successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.error);
        toast.error(response.data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handlePasswordChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="w-full bg-[#6894AA] text-white py-2 px-4 rounded hover:bg-[#51A7D3] focus:ring-4 focus:ring-blue-300"
          >
            Reset Password
          </button>
          <div className="mt-4 text-sm text-gray-600">
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
