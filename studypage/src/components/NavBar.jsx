import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
    return (
        <nav className=" top-0 left-0 right-0 bg-gray-300 shadow-md p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="container mx-auto flex justify-between items-center">
                    <h1>StudyPage</h1>
                    <div className="flex items-center">
                        <Link
                            to="/home"
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
                            to="/experts"
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
                        <div>
                            <Link
                                to="/login"
                                className="bg-blue-400 hover:bg-blue-300/90 py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border rounded"
                            >
                                Login
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="/signup"
                                className="bg-blue-400 hover:bg-blue-300/90 py-1 px-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 border rounded"
                            >
                                Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    )
}
