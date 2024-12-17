import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBook, faTasks, faEnvelope, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const UserProfile = (authToken) => {
    const { currentUser, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            alert("Logged out successfully");
            navigate("/");
        } catch (error) {
            alert("Failed to log out. Please try again.");
        }
    };

    if (!currentUser) {
        return (
            <div className="text-center py-8">
                Please log in to access your profile.
            </div>
        );
    }
    const accountLink = authToken
        ? currentUser?.is_admin
            ? "/admin/dashboard"
            : "/userprofile"
        : "/login";

    // Determine chat link
    const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F9FF] pt-10">
            {/* Toggle Button */}
            <button
                className="md:hidden p-4 bg-[#45B1E8] text-white"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:relative top-0 left-0 w-64 bg-[#C2E1E1] text-[#747474] shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } h-full md:h-auto pt-4 z-20`}>
                <div className="p-4">
                    {/* User Profile */}

                    <div className="flex items-center mb-4 border-b-2 border-gray-200">
                        <Link
                            to="/updateprofile"
                            className="bg-blue-300 rounded-full w-12 h-12 flex justify-center items-center mr-2 mb-2"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                        </Link>

                        <h2 className="text-md text-gray-700">
                            {currentUser.username || "User"}
                        </h2>
                        
                    </div>

                    {/* Navigation */}
                    <nav>
                        <ul>
                            <li className="mb-4">
                                <NavLink
                                    to="dashboard"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                    }
                                >
                                    <FontAwesomeIcon icon={faHome} className="mr-3" />
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="mb-4">
                                <NavLink
                                    to="/userprofile/projectsummary"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                    }
                                >
                                    <FontAwesomeIcon icon={faBook} className="mr-3" />
                                    Courses
                                </NavLink>
                            </li>
                            <li className="mb-4">
                                <NavLink
                                    to="/userprofile/hireexpert"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                    }
                                >
                                    <FontAwesomeIcon icon={faTasks} className="mr-3" />
                                    Projects
                                </NavLink>
                            </li>
                            <li className="mb-4">
                                <NavLink
                                    to="messages"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                    }
                                >
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                                    Messages
                                </NavLink>
                            </li>
                            <li className="mb-4">
                                <Link
                                    to={{
                                        pathname: chatLink,
                                    }}
                                    state={{ authToken }}
                                    className="text-gray-700 hover:text-blue-700 flex items-center text-xs"
                                >
                                    Messages
                                    {/* <FontAwesomeIcon icon={faCommentDots} className="text-lg text-blue-700" /> */}
                                </Link>
                            </li>
                            <li className="mb-4">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-6 w-full text-left flex items-center bg-[#FFFFFF] hover:bg-[#d1d5db] rounded"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#F0F9FF] p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default UserProfile;
