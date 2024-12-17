import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
    const { currentUser, authToken } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    

    // console.log(currentUser.username)
    useEffect(() => {
        if (currentUser ) {
            setUsername(currentUser.username || '');
            setPhoneNumber(currentUser.phone_number || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser ]);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Password validation
        if (password && !/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(password)) {
            toast.error("New password must be at least 8 characters long and include numbers and symbols.");
            return;
        }

        if (!authToken) {
            toast.error("You must be logged in to update your profile.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.put(
                'http://127.0.0.1:5000/update_profile',
                { username, password, phone_number, email },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setUsername('');
                setPassword('');
                setPhoneNumber('');
                setEmail('');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 mt-6 mb-6 w-full max-w-lg">
                <div className="mb-4">
                    <nav className="flex text-sm text-gray-500">
                        <Link to="/userprofile/dashboard" className="hover:text-blue-500">
                            Profile
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700">Update Profile</span>
                    </nav>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Profile</h1>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter new username"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter new email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter new phone number"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>


                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            Password must be at least 8 characters long and include numbers and symbols.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#307CA2] text-white py-2 px-4 rounded hover:bg-[#378EBA] focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
