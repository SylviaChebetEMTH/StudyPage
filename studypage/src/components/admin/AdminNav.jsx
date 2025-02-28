// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell, faEnvelope, faWallet, faCaretDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
// import { Link, NavLink } from 'react-router-dom';

// const AdminNav = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);


//   const toggleDropdown = () => {
//     setShowDropdown((prev) => !prev);
//   };
//   const handleLinkClick = () => {
//     setIsMenuOpen(false);
//   };

//   return (
//     <div>
//       {/* Upper Navigation */}
//       <nav className="bg-gray-900 px-6 py-3 flex flex-wrap justify-between items-center">
//         {/* Left Section */}
//         <div className="flex items-center space-x-6">
//           <div className="text-yellow-500 font-bold text-2xl">
//             <Link to="/">Study<span className="text-white">Page</span></Link>
//           </div>
//         </div>
  
//         {/* Hamburger Menu for smaller screens */}
//         <button
//           className="text-white md:hidden ml-auto"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
//         </button>
  
//         {/* Main Navbar Menu (Responsive behavior) */}
//         <div
//           className={`${
//             isMenuOpen ? 'block' : 'hidden'
//           } absolute top-16 left-0 w-full bg-gray-900 z-50 md:static md:flex md:items-center md:justify-between md:w-auto md:space-x-4`}
//         >
//           <div className="flex flex-col md:flex-row md:space-x-8 text-center md:items-center">
//             <div className="relative text-white py-2 md:py-0">
//               <Link to="/admin/adminreply">
//                 <FontAwesomeIcon icon={faBell} className="text-xl hover:text-yellow-400" />
//               </Link>
//               {notificationCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-600 rounded-full h-4 w-4 flex items-center justify-center text-xs">
//                   {notificationCount}
//                 </span>
//               )}
//             </div>
  
//             {/* Email Icon */}
//             <div className="relative text-white py-2 md:py-0">
//               <FontAwesomeIcon icon={faEnvelope} className="text-xl hover:text-yellow-400" />
//             </div>
  
//             {/* Action Buttons */}
//             <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">Project Search</button>
//             <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">The Studybank [1339]</button>
//           </div>
  
//           {/* Right Section */}
//           <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center py-4 md:py-0">
//             <div className="text-white py-2 md:py-0">
//               <FontAwesomeIcon icon={faWallet} className="text-xl" />
//               <span className="ml-1">$0.00</span>
//             </div>
  
//             <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">Withdraw Funds</button>
  
//             {/* Profile Icon */}
//             <div className="text-white relative py-2 md:py-0">
//               <div className="flex items-center justify-center cursor-pointer" onClick={toggleDropdown}>
//                 <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
//                 <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
//               </div>
  
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
//                   <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
//                     My Profile
//                   </Link>
//                   <Link to="/balance" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
//                     Balance
//                   </Link>
//                   <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
//                     Exit
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
  
//       {/* Lower Navigation */}
//       <nav className="bg-gray-800 border-t border-gray-700 px-6 py-2">
//         {/* Wrapper for centered content */}
//         <div className="flex justify-center">
//           {/* Navigation items */}
//           <ul className="flex flex-wrap justify-center space-x-2 md:space-x-8">
//             <li className="text-yellow-400 font-bold hover:text-yellow-500 cursor-pointer px-2 py-1">Home</li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
//               <NavLink to="/adminchat" className={({isActive}) => isActive ? "text-yellow-400" : ""}>Messages</NavLink>
//             </li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">Auction</li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
//               <NavLink to="admin/projects" className={({isActive}) => isActive ? "text-yellow-400" : ""}>My Projects</NavLink>
//             </li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">Balance</li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">My Profile</li>
//             <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">Settings</li>
//             <li className="text-yellow-400 font-bold hover:text-yellow-500 cursor-pointer px-2 py-1">Community</li>
//           </ul>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default AdminNav;



import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faWallet, faCaretDown, faBars, faTimes, faSearch, faComments } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Link, NavLink, useLocation } from 'react-router-dom';
// import AdminSidebar from "./AdminSidebar";
// import AdminChatBox from "./AdminChatbox";
import AdminSidebar from "../adminChat/AdminSidebar";
import AdminChatBox from "../adminChat/AdminChatbox";
import { UserContext } from "../contexts/userContext";

const AdminPage = () => {
  // State for UI elements
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example count
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Get auth token from context
  const { authToken } = useContext(UserContext);
  const location = useLocation();
  
  // Toggle functions
  const toggleDropdown = () => setShowDropdown(prev => !prev);
  const toggleSidebar = () => setSidebarVisible(prev => !prev);
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <div className="flex flex-col  bg-gray-900">
      {/* Upper Navigation */}
      <nav className="bg-gray-900 px-6 py-3 flex flex-wrap justify-between items-center border-b border-gray-700">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="text-yellow-500 font-bold text-2xl">
            <Link to="/">Study<span className="text-white">Page</span></Link>
          </div>
        </div>
  
        {/* Hamburger Menu for smaller screens */}
        <button
          className="text-white md:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
        </button>
  
        {/* Main Navbar Menu (Responsive behavior) */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } absolute top-16 left-0 w-full bg-gray-900 z-50 md:static md:flex md:items-center md:justify-between md:w-auto md:space-x-4`}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:items-center">
            <div className="relative text-white py-2 md:py-0">
              <Link to="/admin/adminreply">
                <FontAwesomeIcon icon={faBell} className="text-xl hover:text-yellow-400" />
              </Link>
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {notificationCount}
                </span>
              )}
            </div>
  
            {/* Email Icon */}
            <div className="relative text-white py-2 md:py-0">
              <FontAwesomeIcon icon={faEnvelope} className="text-xl hover:text-yellow-400" />
            </div>
  
            {/* Action Buttons */}
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Project Search
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">The Studybank [1339]</button>
          </div>
  
          {/* Right Section */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center py-4 md:py-0">
            <div className="text-white py-2 md:py-0">
              <FontAwesomeIcon icon={faWallet} className="text-xl" />
              <span className="ml-1">$0.00</span>
            </div>
  
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded my-2 md:my-0 transition-colors duration-200">Withdraw Funds</button>
  
            {/* Profile Icon */}
            <div className="text-white relative py-2 md:py-0">
              <div className="flex items-center justify-center cursor-pointer" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
                <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
              </div>
  
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    My Profile
                  </Link>
                  <Link to="/balance" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Balance
                  </Link>
                  <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Exit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  
      {/* Lower Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-2">
        {/* Wrapper for centered content */}
        <div className="flex justify-between items-center">
          {/* Navigation items */}
          <ul className="flex flex-wrap justify-center space-x-2 md:space-x-6">
            <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
              <NavLink to="/admin" end className={({isActive}) => isActive ? "text-yellow-400 font-bold" : ""}>
                Dashboard
              </NavLink>
            </li>
            <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
              <NavLink to="/adminchat" className={({isActive}) => isActive ? "text-yellow-400 font-bold" : ""}>
                <FontAwesomeIcon icon={faComments} className="mr-1" />
                Messages
              </NavLink>
            </li>
            <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
              <NavLink to="admin/projects" className={({isActive}) => isActive ? "text-yellow-400 font-bold" : ""}>
                My Projects
              </NavLink>
            </li>
            <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
              <NavLink to="/admin/balance" className={({isActive}) => isActive ? "text-yellow-400 font-bold" : ""}>
                Balance
              </NavLink>
            </li>
            <li className="text-gray-300 hover:text-yellow-400 cursor-pointer px-2 py-1">
              <NavLink to="/admin/profile" className={({isActive}) => isActive ? "text-yellow-400 font-bold" : ""}>
                Settings
              </NavLink>
            </li>
          </ul>
          
          {/* Toggle sidebar button (only show on Messages page) */}
          {location.pathname === '/adminchat' && (
            <button 
              onClick={toggleSidebar}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      {location.pathname === '/adminchat' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar for conversations */}
          <div className={`${sidebarVisible ? 'block' : 'hidden'} md:block ${sidebarVisible ? 'w-full md:w-80' : 'w-0'} h-full flex-shrink-0 transition-all duration-300`}>
            <AdminSidebar onSelectConversation={setSelectedConversation} />
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col h-full">
            {selectedConversation ? (
              <AdminChatBox
                conversationId={selectedConversation.conversationId}
                conversationDetails={{
                  client: selectedConversation.client,
                  expert: selectedConversation.expert,
                  expert_id: selectedConversation.expert_id
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-900">
                <div className="text-center p-8 max-w-md">
                  <svg 
                    className="w-20 h-20 mx-auto mb-6 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                    />
                  </svg>
                  <h2 className="text-xl font-medium text-white mb-2">Admin Message Center</h2>
                  <p className="text-gray-400 mb-6">
                    Select a conversation from the sidebar to view and respond to messages.
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2"></div>
                    <p className="text-sm text-gray-500">
                      Waiting for selection...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;