import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './contexts/userContext';
import { useSocket } from './contexts/SocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faTimes,
    faCommentDots,
    faBars,
    faCircle
} from '@fortawesome/free-solid-svg-icons';

export const NavBar = () => {
    const { authToken, currentUser } = useContext(UserContext);
    console.log('authtoken', authToken);
    const { unreadCounts } = useSocket();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Calculate total unread messages
    const totalUnreadMessages = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    console.log('totalUnreadMessages', totalUnreadMessages);

    // Determine account link
    const accountLink = authToken
        ? currentUser?.is_admin
            ? "/admin/dashboard"
            : "/userprofile/dashboard"
        : "/login";

        const handleLinkClick = () => {
            setIsMenuOpen(false); 
        };
    
    
    const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

    return (
        <nav className="bg-gray-900">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-yellow-500 font-bold text-2xl">
                    Study<span className="text-white">Page</span>
                </Link>

                {/* Hamburger Icon */}
                <button
                    className="text-white md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
                </button>

                {/* Navigation Links */}
                <div
                    className={`${
                        isMenuOpen ? 'block' : 'hidden'
                    } absolute top-16 left-0 w-full bg-gray-900 z-10 md:static md:flex md:items-center md:justify-between md:w-auto space-x-4`}
                >
                    <div className="flex flex-col md:flex-row md:space-x-8 text-center md:items-center">
                        <Link
                            to="/"
                            className="text-white hover:text-yellow-400 py-2 md:py-0"
                            onClick={handleLinkClick}
                        
                        >
                            Home
                        </Link>
                        <Link
                            to="/services"
                            className="text-white hover:text-yellow-400 py-2 md:py-0"
                            onClick={handleLinkClick}
                        >
                            Services
                        </Link>
                        <Link
                            to="/expertspage"
                            className="bg-transparent text-white py-2 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline md:py-0"
                            currentUser={currentUser}
                            onClick={handleLinkClick}
                        >
                            Our Experts
                        </Link>
                        <Link
                            to="/about"
                            className="text-white hover:text-yellow-400 py-2 md:py-0"
                            onClick={handleLinkClick}
                        >
                            About
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-center py-4 md:py-0">
                        <Link
                            to={accountLink}
                            className="text-white hover:text-yellow-400 flex items-center justify-center text-xs"
                            onClick={handleLinkClick}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-lg" />
                            <span className="ml-1">
                                {authToken ? 'My Account' : 'Login'}
                            </span>
                        </Link>

                        <Link
                            to={chatLink}
                            state={{ authToken }}
                            className="text-gray-700 hover:text-blue-700 flex items-center text-xs relative justify-center"
                            onClick={handleLinkClick}
                        >
                            <FontAwesomeIcon
                                icon={faCommentDots}
                                className="text-lg text-green-700"
                            />
                            {totalUnreadMessages > 0 && (
                                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faCircle}
                                        className="text-red-500 text-sm"
                                    />
                                    <span className="absolute text-white text-xs font-bold">
                                        {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                                    </span>
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

    );
};