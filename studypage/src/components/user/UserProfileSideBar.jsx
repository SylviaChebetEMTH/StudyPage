import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBook, faTasks, faEnvelope, faSignOutAlt, faUser, faBars } from "@fortawesome/free-solid-svg-icons";

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

    const handleLinkClick = () => {
        setSidebarOpen(false); 
    };

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
                className="md:hidden p-4 bg-[#194e6b] text-white"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
                {/* Hamburger Icon (FontAwesome) */}
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:relative top-2 left-2 w-64 bg-gray-600 text-gray-300 shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } h-full mb-6 md:h-auto pt-4 z-20`}>
                <div className="p-4">
                    {/* User Profile */}

                    <div className="flex items-center mb-4 border-b-2 border-gray-200">
                        <Link
                            to="/updateprofile"
                            className="bg-blue-300 rounded-full w-12 h-12 flex justify-center items-center mr-2 mb-2"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                        </Link>

                        <h2 className="text-md text-gray-300">
                            {currentUser.username || "User"}
                        </h2>
                    </div>

                    {/* Navigation */}
                    <nav>
                        <ul>
                            <li className="mb-4 text-gray-500">
                                <NavLink
                                    to="dashboard"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faHome} className="mr-3" />
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="mb-4 text-gray-500">
                                <NavLink
                                    to="/userprofile/projectsummary"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faBook} className="mr-3" />
                                    Courses
                                </NavLink>
                            </li>
                            <li className="mb-4 text-gray-500">
                                <NavLink
                                    to="/userprofile/hireexpert"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faTasks} className="mr-3" />
                                    Projects
                                </NavLink>
                            </li>
                            <li className="mb-4 text-gray-500">
                                <NavLink
                                    to={{
                                        pathname: chatLink,
                                    }}
                                    state={{ authToken }}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "px-4 py-6 bg-[#769594] rounded flex items-center"
                                            : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
                                    }
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                                    Messages
                                </NavLink>
                            </li>
                           
                            <li className="mb-4 text-gray-500">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-6 w-full text-left flex items-center bg-gray-300 hover:bg-gray-400 rounded"
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
