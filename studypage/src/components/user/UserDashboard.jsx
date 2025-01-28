import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { FaUserAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="min-h-screen bg-gray-500 rounded p-4 sm:p-6 md:p-8">
            <div className="bg-gray-700 shadow-md rounded-lg p-6 max-w-4xl mx-auto h-full mt-6">
                {/* Welcome Section */}
                <div className="flex items-center space-x-4">

                    <Link
                        to="/updateprofile"
                        className="w-16 h-16 bg-blue-300 text-white flex items-center justify-center rounded-full text-2xl"
                    >
                        <FaUserAlt />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-200">Welcome back, {currentUser.username}!</h1>
                        <p className="text-gray-400">Email: {currentUser.email}</p>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-200">Your Dashboard</h2>
                    <p className="mt-2 text-gray-300">
                        Welcome to your dashboard. Here, you can monitor your activity, track your progress, and explore available resources.
                    </p>

                    {/* Stats or Overview Sections */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Section 1: Projects */}
                        <div className="p-6 bg-red-300 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
                            <p className="mt-2 text-gray-600">View and manage your projects here.</p>
                            <Link to="/userprofile/projectsummary" className="text-blue-500 hover:underline mt-2 inline-block">View Projects</Link>
                        </div>

                        {/* Example Section 2: Progress */}
                        <div className="p-6 bg-blue-300 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
                            <p className="mt-2 text-gray-600">Track your study progress and achievements.</p>
                            <a href="/progress" className="text-blue-500 hover:underline mt-2 inline-block">View Progress</a>
                        </div>

                        {/* Example Section 3: Account Settings */}
                        <div className="p-6 bg-orange-300 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
                            <p className="mt-2 text-gray-600">Update your account settings and preferences.</p>
                            <Link to="/updateprofile" className="text-blue-500 hover:underline mt-2 inline-block">Go to Settings</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UserDashboard;
