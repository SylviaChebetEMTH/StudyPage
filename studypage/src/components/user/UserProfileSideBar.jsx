// import React, { useContext, useState } from "react";
// import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
// import { UserContext } from "../contexts/userContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome, faBook, faTasks, faEnvelope, faSignOutAlt, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UserProfile = (authToken) => {
//     const { currentUser, logout } = useContext(UserContext);
//     const navigate = useNavigate();
//     const [isSidebarOpen, setSidebarOpen] = useState(false);

//     const handleLogout = async () => {
//         try {
//             await logout();
//             toast.success("Logged out successfully");
//             navigate("/");
//         } catch (error) {
//             toast.error("Failed to log out. Please try again.");
//         }
//     };

//     if (!currentUser) {
//         return (
//             <div className="text-center py-8">
//                 Please log in to access your profile.
//             </div>
//         );
//     }

//     const handleLinkClick = () => {
//         setSidebarOpen(false); 
//     };

//     const accountLink = authToken
//         ? currentUser?.is_admin
//             ? "/admin/dashboard"
//             : "/userprofile"
//         : "/login";

//     // Determine chat link
//     const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

//     return (
//         <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F9FF] pt-10">
//             {/* Toggle Button */}
//             <button
//                 className="md:hidden p-4 bg-[#194e6b] text-white"
//                 onClick={() => setSidebarOpen(!isSidebarOpen)}
//             >
//                 {/* Hamburger Icon (FontAwesome) */}
//                 <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
//             </button>

//             {/* Sidebar */}
//             <aside
//                 className={`fixed md:relative top-2 left-2 w-64 bg-gray-600 text-gray-300 shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//                     } h-full mb-6 md:h-auto pt-4 z-20`}>
//                 <div className="p-4">
//                     {/* User Profile */}

//                     <div className="flex items-center mb-4 border-b-2 border-gray-200">
//                         <Link
//                             to="/updateprofile"
//                             className="bg-blue-300 rounded-full w-12 h-12 flex justify-center items-center mr-2 mb-2"
//                         >
//                             <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
//                         </Link>

//                         <h2 className="text-md text-gray-300">
//                             {currentUser.username || "User"}
//                         </h2>
//                     </div>

//                     {/* Navigation */}
//                     <nav>
//                         <ul>
//                             <li className="mb-4 text-gray-500">
//                                 <NavLink
//                                     to="dashboard"
//                                     className={({ isActive }) =>
//                                         isActive
//                                             ? "px-4 py-6 bg-[#769594] rounded flex items-center"
//                                             : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
//                                     }
//                                     onClick={handleLinkClick}
//                                 >
//                                     <FontAwesomeIcon icon={faHome} className="mr-3" />
//                                     Dashboard
//                                 </NavLink>
//                             </li>
//                             <li className="mb-4 text-gray-500">
//                                 <NavLink
//                                     to="/userprofile/projectsummary"
//                                     className={({ isActive }) =>
//                                         isActive
//                                             ? "px-4 py-6 bg-[#769594] rounded flex items-center"
//                                             : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
//                                     }
//                                     onClick={handleLinkClick}
//                                 >
//                                     <FontAwesomeIcon icon={faBook} className="mr-3" />
//                                     Courses
//                                 </NavLink>
//                             </li>
//                             <li className="mb-4 text-gray-500">
//                                 <NavLink
//                                     to="/userprofile/hireexpert"
//                                     className={({ isActive }) =>
//                                         isActive
//                                             ? "px-4 py-6 bg-[#769594] rounded flex items-center"
//                                             : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
//                                     }
//                                     onClick={handleLinkClick}
//                                 >
//                                     <FontAwesomeIcon icon={faTasks} className="mr-3" />
//                                     Projects
//                                 </NavLink>
//                             </li>
//                             <li className="mb-4 text-gray-500">
//                                 <NavLink
//                                     to={{
//                                         pathname: chatLink,
//                                     }}
//                                     state={{ authToken }}
//                                     className={({ isActive }) =>
//                                         isActive
//                                             ? "px-4 py-6 bg-[#769594] rounded flex items-center"
//                                             : "px-4 py-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center"
//                                     }
//                                     onClick={handleLinkClick}
//                                 >
//                                     <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
//                                     Messages
//                                 </NavLink>
//                             </li>
                           
//                             <li className="mb-4 text-gray-500">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="px-4 py-6 w-full text-left flex items-center bg-gray-300 hover:bg-gray-400 rounded"
//                                 >
//                                     <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
//                                     Logout
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 bg-[#F0F9FF] p-6">
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default UserProfile;





import React, { useContext, useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faBook, 
  faTasks, 
  faEnvelope, 
  faSignOutAlt, 
  faUser, 
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = ({ authToken }) => {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");
      
      if (
        isSidebarOpen &&
        sidebar && 
        !sidebar.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle body overflow when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 text-orange-600">
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <FontAwesomeIcon icon={faUser} className="text-orange-600 text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Access Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your profile and dashboard.</p>
          <Link 
            to="/login" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const accountLink = authToken
    ? currentUser?.is_admin
      ? "/admin/dashboard"
      : "/userprofile"
    : "/login";

  const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

  // Navigation items for DRY code
  const navItems = [
    {
      to: "dashboard",
      icon: faHome,
      label: "Dashboard"
    },
    {
      to: "/userprofile/projectsummary",
      icon: faBook,
      label: "Courses"
    },
    {
      to: "/userprofile/hireexpert",
      icon: faTasks,
      label: "Projects"
    },
    {
      to: chatLink,
      icon: faEnvelope,
      label: "Messages",
      state: { authToken }
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toggle Button */}
      <button
        id="sidebar-toggle"
        className="fixed top-4 left-4 z-30 md:hidden p-3 bg-yellow-500 text-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        <FontAwesomeIcon 
          icon={isSidebarOpen ? faTimes : faBars} 
          className="w-5 h-5" 
        />
      </button>

      <div className="flex flex-col md:flex-row  md:pt-0  ">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`fixed md:sticky top-0 left-0 h-full md:h-screen w-72 bg-white shadow-lg transition-transform duration-300 ease-in-out z-30 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-6 bg-gray-900 md:bg-gray-800 text-white">
              <div className="flex items-center space-x-4">
                <Link
                  to="/updateprofile"
                  className="bg-orange-600 bg-opacity-25 rounded-full w-14 h-14 flex justify-center items-center hover:bg-opacity-40 transition duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                </Link>
                <div>
                  <h2 className="text-lg font-semibold">
                    {currentUser.username || "User"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {currentUser.is_admin ? "Administrator" : "Student"}
                  </p>
                  <Link 
                    to="/updateprofile" 
                    className="text-xs text-yellow-500 hover:text-yellow-400 hover:underline mt-1 inline-block"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-grow p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      state={item.state}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-md flex items-center transition-colors duration-200 ${
                          isActive
                            ? "bg-orange-100 text-orange-600 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      onClick={handleLinkClick}
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                
                <li className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 w-full text-left flex items-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5 h-5" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="p-4 text-xs text-center text-gray-500 border-t border-gray-200">
              <p>© 2025 StudyPage</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pt-4 md:ml-0">
          <div className="bg-white rounded-lg shadow-md min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;