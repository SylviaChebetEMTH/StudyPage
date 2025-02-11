import React, { useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faCog, faSignOutAlt, faUserTie, faBook, faTasks } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/userContext';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
    const handleLinkClick = () => {
        setSidebarOpen(false); 
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error) {
            toast.error("Failed to log out. Please try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F9FF] pt-10">
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
            <aside className={`fixed md:relative top-0 left-0 w-64 bg-[#C2E1E1] text-[#747474] shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full "
                } h-full overflow-y-auto pt-16 z-20`}>
                <nav className="p-4">
                    <ul>
                        <li className="mb-4">
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-6 bg-[#769594] rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                                onClick={handleLinkClick}
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-3 w-6 h-6" />
                                Dashboard
                            </NavLink>
                        </li>

                        <li className="mb-4">                                                                   
                            <button
                                onClick={handleProductsClick}
                                className="w-full text-left flex items-center px-4 py-6 block bg-[#FFFFFF] hover:bg-[#d1d5db] rounded mb-4"
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
                                                    ? "block px-4 py-4 bg-[#769594] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                            onClick={handleLinkClick}
                                        >
                                            All Experts
                                        </NavLink>
                                    </li>
                                    <li className="mb-4">
                                        <NavLink
                                            to="addexpert"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#769594] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                            onClick={handleLinkClick}
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
                                className="w-full text-left flex items-center px-4 py-6 mb-4 block bg-[#FFFFFF] hover:bg-[#d1d5db] rounded"
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
                                                    ? "block px-4 py-4 bg-[#769594] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                            onClick={handleLinkClick}
                                        >
                                            All Services
                                        </NavLink>
                                    </li>
                                    <li className="mb-4">
                                        <NavLink
                                            to="addservice"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-4 bg-[#769594] rounded flex items-center text-white"
                                                    : "block px-4 py-4 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                            }
                                            onClick={handleLinkClick}
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
                                        ? "block px-4 py-6 bg-[#769594] rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                                onClick={handleLinkClick}
                            >
                                <FontAwesomeIcon icon={faUsers} className="mr-3 w-6 h-6" />
                                User Management
                            </NavLink>
                        </li>
                        <li className="mb-4">
                            <NavLink
                                to="projecttypes"
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-6 bg-[#769594] rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                                onClick={handleLinkClick}
                            >
                                <FontAwesomeIcon icon={faTasks} className="mr-3 w-6 h-6" />
                                Project Types
                            </NavLink>
                        </li>
                        <li className="mb-4">
                            <NavLink
                                to="subjectarea"
                                className={({ isActive }) =>
                                    isActive
                                        ? "block px-4 py-6 bg-[#769594] rounded flex items-center text-white"
                                        : "block px-4 py-6 bg-[#FFFFFF] hover:bg-[#d1d5db] rounded flex items-center"
                                }
                                onClick={handleLinkClick}
                            >
                                <FontAwesomeIcon icon={faBook} className="mr-3 w-6 h-6" />
                                Subject Area
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
            <main className="flex-1 bg-[#F0F9FF] p-4 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardSidebar;
