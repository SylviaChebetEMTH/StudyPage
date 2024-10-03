import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCogs, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
    const [users, setUsers] = useState([]); 
    const [services, setServices] = useState([]); 
    const [experts, setExperts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const { authToken } = useContext(UserContext); 
    const token = authToken || localStorage.getItem("access_token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch users
                const usersResponse = await fetch("http://127.0.0.1:5000/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!usersResponse.ok) {
                    throw new Error("Failed to fetch users");
                }
                const usersData = await usersResponse.json();
                setUsers(usersData?.users || []);  // Ensure a fallback empty array

                // Fetch services
                const servicesResponse = await fetch("http://127.0.0.1:5000/services", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!servicesResponse.ok) {
                    throw new Error("Failed to fetch services");
                }
                const servicesData = await servicesResponse.json();
                setServices(servicesData?.services || []); // Ensure a fallback empty array

                // Fetch experts
                const expertsResponse = await fetch("http://127.0.0.1:5000/experts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!expertsResponse.ok) {
                    throw new Error("Failed to fetch experts");
                }
                const expertsData = await expertsResponse.json();
                setExperts(expertsData?.experts || []); // Ensure a fallback empty array

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Study Dashboard</h1>

            {/* Users, Services, and Experts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 w-full">
                {/* Users */}
                <div className="flex flex-col items-center bg-blue-500 text-white rounded-lg shadow-md p-6">
                    <FontAwesomeIcon icon={faUser} className="w-16 h-16 mb-4" />
                    <div className="text-lg font-semibold">Users</div>
                    <div className="text-2xl mt-2">{users.length}</div>
                </div>

                {/* Services */}
                <div className="flex flex-col items-center bg-green-500 text-white rounded-lg shadow-md p-6">
                    <FontAwesomeIcon icon={faCogs} className="w-16 h-16 mb-4" />
                    <div className="text-lg font-semibold">Services</div>
                    <div className="text-2xl mt-2">{services.length}</div>
                </div>

                {/* Experts */}
                <div className="flex flex-col items-center bg-yellow-500 text-white rounded-lg shadow-md p-6">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="w-16 h-16 mb-4" />
                    <div className="text-lg font-semibold">Experts</div>
                    <div className="text-2xl mt-2">{experts.length}</div>
                </div>
            </div>

            {/* Display users */}
            <div className="w-full max-w-sm mx-auto md:max-w-none gap-4 mb-8">
                <h2 className="text-2xl font-medium text-gray-800 mb-4">Users</h2>
                <div className="bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Display services */}
            <div className="w-full max-w-sm mx-auto md:max-w-none gap-4 mb-8">
                <h2 className="text-2xl font-medium text-gray-800 mb-4">Services</h2>
                <div className="bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{service.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{service.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{service.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Display experts */}
            <div className="w-full max-w-sm mx-auto md:max-w-none gap-4 mb-8">
                <h2 className="text-2xl font-medium text-gray-800 mb-4">Experts</h2>
                <div className="bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expertise</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {experts.map((expert) => (
                                <tr key={expert.id}>
                                    <td className="px-4 py-3 text-sm text-gray-500">{expert.id}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{expert.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{expert.expertise}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
