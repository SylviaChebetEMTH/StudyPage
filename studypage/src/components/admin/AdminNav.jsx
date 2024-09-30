import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
    return (
        <nav className="bg-gray-300 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/admin" className="text-black hover:text-gray-400">
                    ScoreGrade
                </Link>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/admin/services" className="text-black hover:text-gray-400">
                            Manage Services
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/users" className="text-black hover:text-gray-400">
                            Manage Users
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/bookings" className="text-black hover:text-gray-400">
                            Manage Bookings
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/reviews" className="text-black hover:text-gray-400">
                            Manage Reviews
                        </Link>
                    </li>
                    <li>
                        <Link to="/logout" className="text-black hover:text-gray-400">
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminNav;
