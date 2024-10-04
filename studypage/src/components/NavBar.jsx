import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './contexts/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const NavBar = () => {
    const { authToken, currentUser } = useContext(UserContext);

    const accountLink = authToken
        ? currentUser?.is_admin
            ? "/admin/dashboard"
            : "/userprofile/dashboarduser"
        : "/login";

    return (
        <nav className=" top-0 left-0 right-0 bg-gray-300 shadow-md p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="container mx-auto flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-xl font-semibold text-black"
                    >
                        StudyPage
                    </Link>
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="bg-transparent py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline"
                        >
                            Home
                        </Link>
                        <Link
                            to="/services"
                            className="bg-transparent py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline"
                        >
                            Services
                        </Link>
                        <Link
                            to="/expertspage"
                            className="bg-transparent py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline"
                        >
                            Our Experts
                        </Link>
                        <Link
                            to="/about"
                            className="bg-transparent py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 hover:underline"
                        >
                            About Us
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <Link to={accountLink} className="text-gray-700 hover:text-blue-700 flex items-center text-xs">
                            <FontAwesomeIcon icon={faUser} className="text-lg" />
                            <span className="ml-1">{authToken ? 'My Account' : 'Login'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

    )
}
