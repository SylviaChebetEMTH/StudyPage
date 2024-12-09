import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faWallet, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Link, NavLink } from 'react-router-dom';

const AdminNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
 

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div>
      {/* Upper Navigation */}
      <nav className="bg-[#66B5B3] px-6 py-3 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="text-white font-bold text-2xl">
            <Link to="/">StudyPages</Link>
          </div>
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
        <div className="flex items-center space-x-6 relative">
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
      </nav>

      {/* Lower Navigation */}
      <nav className="bg-white border-t border-gray-300 px-6 py-2 flex justify-center">
        <ul className="flex space-x-6">
          <li className="text-black font-bold hover:text-blue-600 cursor-pointer">Home</li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Messenger</li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Auction</li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">
              <NavLink to="/projects">My Projects</NavLink>
          </li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Balance</li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">My Profile</li>
          <li className="text-gray-500 hover:text-blue-600 cursor-pointer">Settings</li>
          <li className="text-black font-bold hover:text-blue-600 cursor-pointer">Community</li>
        </ul>
      </nav>

      {/* Admin Chat - Reply Section */}
      
    </div>
  );
};

export default AdminNav;
