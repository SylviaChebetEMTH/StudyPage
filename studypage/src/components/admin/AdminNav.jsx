import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faWallet, faCaretDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Link, NavLink } from 'react-router-dom';

const AdminNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);


  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* Upper Navigation */}
      <nav className="bg-[#66B5B3] px-6 py-3 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="text-white font-bold text-2xl">
            <Link to="/">StudyPage</Link>
          </div>
        </div>

        {/* Hamburger Menu for smaller screens (visible only on small screens) */}
        <button
          className="text-white md:hidden ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
        </button>

        {/* Main Navbar Menu (Responsive behavior) */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'
            } absolute top-16 left-0 w-full bg-[#66B5B3] z-10 md:static md:flex md:items-center md:justify-between md:w-auto space-x-4`}
        >
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:items-center">
            <div className="relative text-white">
              <Link to="/admin/adminreply">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
              </Link>
              <span className="absolute -top-2 -right-2 bg-red-600 rounded-full h-4 w-4 flex items-center justify-center text-xs">
                {notificationCount}
              </span>
            </div>

            {/* Email Icon */}
            <div className="relative text-white">
              <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
            </div>

            {/* Action Buttons */}
            <button className="bg-[#739B9A] text-white px-3 py-1 rounded">Project Search</button>
            <button className="bg-[#739B9A] text-white px-3 py-1 rounded">The Studybank [1339]</button>
          </div>

          {/* Right Section */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center py-4 md:py-0">
            <div className="text-white">
              <FontAwesomeIcon icon={faWallet} className="text-xl" />
              <span className="ml-1">$0.00</span>
            </div>

            <button className="bg-[#739B9A] text-white px-3 py-1 rounded">Withdraw Funds</button>

            {/* Profile Icon */}
            <div className="text-white relative">
              <FontAwesomeIcon icon={faUserCircle} className="text-2xl cursor-pointer" onClick={toggleDropdown} />
              <FontAwesomeIcon icon={faCaretDown} className="ml-2 cursor-pointer" onClick={toggleDropdown} />

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
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

      <nav className="bg-white border-t border-gray-300 px-6 py-2">
        {/* Wrapper for centered content */}
        <div className="flex justify-center">
          {/* Navigation items */}
          <ul className="flex space-x-6 flex-wrap justify-center md:space-x-8">
            <li className="text-black font-bold hover:text-blue-600 cursor-pointer">Home</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">
              <NavLink to="/adminchat">Messages</NavLink>
            </li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Auction</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">
              <NavLink to="admin/projects">My Projects</NavLink>
            </li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Balance</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">My Profile</li>
            <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Settings</li>
            <li className="text-black font-bold hover:text-blue-600 cursor-pointer">Community</li>
          </ul>
        </div>
      </nav>


      {/* Admin Chat - Reply Section */}

    </div>
  );
};

export default AdminNav;
