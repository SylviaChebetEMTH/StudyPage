import React, { useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faCog, faSignOutAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/userContext';

const AdminDashboardSidebar = () => {
    const { logout } = useContext(UserContext);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isExpertOpen, setExpertsOpen] = useState(false);
    const [isServiceOpen, setServiceOpen] = useState(false);
    const navigate = useNavigate();

    const handleProductsClick = () => {
        setExpertsOpen(!isExpertOpen);
    };
    const handleServiceClick = () => {
        setServiceOpen(!isServiceOpen);
    }

    const handleLogout = async () => {
        try {
            await logout();
            alert("Logged out successfully");
            navigate("/");
        } catch (error) {
            alert("Failed to log out. Please try again.");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Toggle Button for Mobile */}
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
            <aside className={`w-64 bg-slate-300 mt-10 text-[#747474] shadow-md h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <nav className="p-4">
                    <ul>
                        <li className="mb-4">
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-6 bg-gray-400 rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-3 w-6 h-6" />
                                Dashboard
                            </NavLink>
                        </li>

                        <li className="mb-4">
                            <button
                                onClick={handleProductsClick}
                                className="w-full text-left flex items-center px-4 py-6 block bg-[#FFFFFF] hover:bg-[#d1d5db] rounded"
                            >
                                <FontAwesomeIcon icon={faUserTie} className="mr-3 w-6 h-6" />
                                Expert Management
                                <span
                                    className={`ml-auto transition-transform ${isExpertOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                            {isExpertOpen && (
                                <ul className="ml-4">
                                    <li className="mb-4">
                                        <NavLink
                                            to="allexperts"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#45B1E8] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                        >
                                            All Experts
                                        </NavLink>
                                    </li>
                                    <li className="mb-4">
                                        <NavLink
                                            to="addexpert"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#45B1E8] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                        >
                                            Add Expert
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-4">
                            <button
                                onClick={handleServiceClick}
                                className="w-full text-left flex items-center px-4 py-6 block bg-[#FFFFFF] hover:bg-[#d1d5db] rounded"
                            >
                                <FontAwesomeIcon icon={faCog} className="mr-3 w-6 h-6" />
                                Service Management
                                <span
                                    className={`ml-auto transition-transform ${isServiceOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                            {isServiceOpen && (
                                <ul className="ml-4">
                                    <li className="mb-4">
                                        <NavLink
                                            to="allservices"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#45B1E8] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                        >
                                            All Services
                                        </NavLink>
                                    </li>
                                    <li className="mb-4">
                                        <NavLink
                                            to="products/add"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#45B1E8] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                        >
                                            Add Service
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-4">
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-6 bg-[#45B1E8] rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                            >
                                <FontAwesomeIcon icon={faUsers} className="mr-3 w-6 h-6" />
                                User Management
                            </NavLink>
                        </li>
                        <li className="mb-4">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center px-4 py-6 block bg-[#FFFFFF] hover:bg-[#d1d5db] rounded"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-6 h-6" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-[#F0F9FF] p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardSidebar;
