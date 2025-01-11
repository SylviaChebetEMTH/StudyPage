// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { UserContext } from './contexts/userContext';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCommentDots } from '@fortawesome/free-solid-svg-icons';

// export const NavBar = () => {
//     const { authToken, currentUser } = useContext(UserContext);
//     console.log('adminauthtoken', authToken);
//     console.log('this is the user',currentUser)

//     // Determine account link
//     const accountLink = authToken
//         ? currentUser?.is_admin
//             ? "/admin/dashboard"
//             : "/userprofile/dashboard"
//         : "/login";

//     // Determine chat link
//     const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

//     return (
//         <nav className="flex justify-between items-center px-10 py-6 bg-gray-900">
//             <div className="container mx-auto flex justify-between items-center">
//                 <Link
//                     to="/"
//                     className="text-yellow-500 font-bold text-2xl"
//                 >
//                     Study<span className="text-white">Page</span>
//                 </Link>
//                 <div className="flex items-center space-x-8">
//                     <Link
//                         to="/"
//                         className="text-white hover:text-yellow-400 cursor-pointer"
//                     >
//                         Home
//                     </Link>
//                     <Link
//                         to="/services"
//                         className="text-white hover:text-yellow-400 cursor-pointer"
//                     >
//                         Services
//                     </Link>
//                     <Link
//                         to="/expertspage"
//                         className="bg-transparent py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline"
//                         currentUser={currentUser}
//                     >
//                         Our Experts
//                     </Link>
//                     <Link
//                         to="/about"
//                         className="text-white hover:text-yellow-400 cursor-pointer"
//                     >
//                         About
//                     </Link>
//                 </div>
//                 <div className="flex gap-4">
//                     <Link to={accountLink} className="text-white hover:text-yellow-400 cursor-pointer flex items-center text-xs">
//                         <FontAwesomeIcon icon={faUser} className="text-lg" />
//                         <span className="ml-1">{authToken ? 'My Account' : 'Login'}</span>
//                     </Link>

//                     <Link
//                         to={{
//                             pathname: chatLink, // Dynamic path based on user role
//                         }}
//                         state={{ authToken }} // Pass authToken in state
//                         className="text-gray-700 hover:text-blue-700 flex items-center text-xs"
//                     >
//                         <FontAwesomeIcon icon={faCommentDots} className="text-lg text-blue-700" />
//                     </Link>
//                 </div>
//             </div>
//         </nav>
//     );
// };

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './contexts/userContext';
import { useSocket } from './contexts/SocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCommentDots, 
  faCircle,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export const NavBar = () => {
    const { authToken, currentUser } = useContext(UserContext);
    const { unreadCounts } = useSocket();
    const [isOpen, setIsOpen] = useState(false);

    // Calculate total unread messages
    const totalUnreadMessages = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    console.log('totalUnreadMessages', totalUnreadMessages);

    // Determine account link
    const accountLink = authToken
        ? currentUser?.is_admin
            ? "/admin/dashboard"
            : "/userprofile/dashboard"
        : "/login";

    // Determine chat link
    const chatLink = currentUser?.is_admin ? "/adminchat" : "/chat";

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="bg-gray-900">
        <div className="container mx-auto px-4 py-4 md:px-10 md:py-6">
            <div className="flex justify-between items-center">
                {/* Logo - always visible */}
                <Link to="/" className="text-yellow-500 font-bold text-xl md:text-2xl" onClick={closeMenu}>
                    Study<span className="text-white">Page</span>
                </Link>

                {/* Mobile menu button */}
                <button 
                    className="md:hidden text-white hover:text-yellow-400"
                    onClick={toggleMenu}
                >
                    <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-2xl" />
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-white hover:text-yellow-400">
                        Home
                    </Link>
                    <Link to="/services" className="text-white hover:text-yellow-400">
                        Services
                    </Link>
                    <Link to="/expertspage" className="text-white hover:text-yellow-400 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline">
                        Our Experts
                    </Link>
                    <Link to="/about" className="text-white hover:text-yellow-400">
                        About
                    </Link>
                </div>

                {/* Desktop Account/Chat Icons */}
                <div className="hidden md:flex gap-4">
                    <Link to={accountLink} className="text-white hover:text-yellow-400 flex items-center text-xs">
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                        <span className="ml-1">
                            {authToken ? 'My Account' : 'Login'}
                        </span>
                    </Link>

                    <Link to={chatLink} state={{ authToken }} className="text-gray-700 hover:text-blue-700 flex items-center text-xs relative">
                        <FontAwesomeIcon icon={faCommentDots} className="text-lg text-blue-700" />
                        {totalUnreadMessages > 0 && (
                            <div className="absolute -top-2 -right-2 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCircle} className="text-red-500 text-sm" />
                                <span className="absolute text-white text-xs font-bold">
                                    {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                                </span>
                            </div>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
                <div className="flex flex-col space-y-4 pb-4">
                    <Link to="/" className="text-white hover:text-yellow-400" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link to="/services" className="text-white hover:text-yellow-400" onClick={closeMenu}>
                        Services
                    </Link>
                    <Link to="/expertspage" className="text-white hover:text-yellow-400" onClick={closeMenu}>
                        Our Experts
                    </Link>
                    <Link to="/about" className="text-white hover:text-yellow-400" onClick={closeMenu}>
                        About
                    </Link>
                    <div className="pt-4 border-t border-gray-700">
                        <Link to={accountLink} className="text-white hover:text-yellow-400 flex items-center text-sm" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faUser} className="text-lg mr-2" />
                            {authToken ? 'My Account' : 'Login'}
                        </Link>
                        <Link to={chatLink} state={{ authToken }} className="text-gray-700 hover:text-blue-700 flex items-center text-sm mt-4 relative" onClick={closeMenu}>
                            <FontAwesomeIcon icon={faCommentDots} className="text-lg text-blue-700 mr-2" />
                            Messages
                            {totalUnreadMessages > 0 && (
                                <div className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    );
};