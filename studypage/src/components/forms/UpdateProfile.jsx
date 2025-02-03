import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const UpdateProfile = () => {
    const { currentUser, authToken } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    // console.log(currentUser.username)
    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
            setPhoneNumber(currentUser.phone_number || '');
            setEmail(currentUser.email || '');
        }
    }, [currentUser]);


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
                'https://backendstudypage.onrender.com/update_profile',
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
        <div className="flex justify-center items-center min-h-screen bg-gray-400 p-4 sm:p-6 md:p-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 mt-6 mb-6 w-full max-w-lg">
                <div className="mb-4">
                    <nav className="flex text-sm text-gray-400">
                        <Link to="/userprofile/dashboard" className="hover:text-yellow-500">
                            Profile
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-500">Update Profile</span>
                    </nav>
                </div>

                <h1 className="text-2xl font-bold text-gray-200 mb-6 text-center">Update Profile</h1>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 hover:underline">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter new username"
                            className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 hover:underline">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter new email"
                            className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
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


                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 hover:underline">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="mt-1 px-3 py-2 bg-gray-700 rounded-md w-full sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:ring-2 hover:ring-yellow-500"
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            Password must be at least 8 characters long and include numbers and symbols.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
