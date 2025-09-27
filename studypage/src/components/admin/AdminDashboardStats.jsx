import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { UserContext } from "../contexts/userContext";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCogs, faChalkboardTeacher, faTasks, faBook } from "@fortawesome/free-solid-svg-icons";
import AdminChart from './AdminChart';
import { Circles } from "react-loader-spinner";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [experts, setExperts] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useContext(UserContext);
    const token = authToken || localStorage.getItem("access_token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch users
                const usersResponse = await fetch("https://studypage-h2eu.onrender.com/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!usersResponse.ok) {
                    throw new Error("Failed to fetch users");
                }
                const usersData = await usersResponse.json();
                setUsers(usersData?.users || []);

                // Fetch services
                const servicesResponse = await fetch("https://studypage-h2eu.onrender.com/services", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!servicesResponse.ok) {
                    throw new Error("Failed to fetch services");
                }
                const servicesData = await servicesResponse.json();
                setServices(servicesData?.services || []);

                // Fetch experts
                const expertsResponse = await fetch("https://studypage-h2eu.onrender.com/experts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!expertsResponse.ok) {
                    throw new Error("Failed to fetch experts");
                }
                const expertsData = await expertsResponse.json();
                setExperts(expertsData?.experts || []);

                // Fetch project types
                const fetchProjectTypes = async () => {
                    try {
                        const response = await axios.get('https://studypage-h2eu.onrender.com/project-types');
                        setProjectTypes(response.data);
                    } catch (error) {
                        console.error("Error fetching project types:", error);
                    }
                };

                // Fetch subjects
                const fetchSubjects = async () => {
                    try {
                        const response = await axios.get('https://studypage-h2eu.onrender.com/subjects');
                        setSubjects(response.data);
                    } catch (error) {
                        console.error("Error fetching subjects:", error);
                    }
                };

                // Call the fetch functions
                await fetchProjectTypes();
                await fetchSubjects();

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-4">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#6E8F9F] bg-opacity-75"
                    style={{ zIndex: 9999 }}>

                    <Circles
                        height="80"
                        width="80"
                        color="#296A8B"
                        ariaLabel="loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                    <span className="mt-4 text-white font-medium text-lg">
                        Upload in progress..
                    </span>
                </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

            {/* Users, Services, and Experts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 w-full">
                <Link to="/admin/users" className="w-full">
                    <div className="flex flex-col items-center bg-blue-400 text-white rounded-lg shadow-md p-6">
                        <FontAwesomeIcon icon={faUser} className="w-16 h-16 mb-4" />
                        <div className="text-lg font-semibold">Users</div>
                        <div className="text-2xl mt-2">{users.length}</div>
                    </div>
                </Link>

                <Link to="/admin/allservices" className="w-full">
                    <div className="flex flex-col items-center bg-green-400 text-white rounded-lg shadow-md p-6">
                        <FontAwesomeIcon icon={faCogs} className="w-16 h-16 mb-4" />
                        <div className="text-lg font-semibold">Services</div>
                        <div className="text-2xl mt-2">{services.length}</div>
                    </div>
                </Link>

                <Link to="/admin/allexperts" className="w-full">
                    <div className="flex flex-col items-center bg-yellow-400 text-white rounded-lg shadow-md p-6">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="w-16 h-16 mb-4" />
                        <div className="text-lg font-semibold">Experts</div>
                        <div className="text-2xl mt-2">{experts.length}</div>
                    </div>
                </Link>
                <Link to="/admin/projecttypes" className="w-full">
                    <div className="flex flex-col items-center bg-pink-400 text-white rounded-lg shadow-md p-6">
                        <FontAwesomeIcon icon={faTasks} className="w-16 h-16 mb-4" />
                        <div className="text-lg font-semibold">Project Types</div>
                        <div className="text-2xl mt-2">{projectTypes.length}</div>
                    </div>
                </Link>
                <Link to="/admin/subjectarea" className="w-full">
                    <div className="flex flex-col items-center bg-orange-400 text-white rounded-lg shadow-md p-6">
                        <FontAwesomeIcon icon={faBook} className="w-16 h-16 mb-4" />
                        <div className="text-lg font-semibold">Subjects</div>
                        <div className="text-2xl mt-2">{subjects.length}</div>
                    </div>
                </Link>
            </div>
            <div className="mb-8 w-full max-w-lg mx-auto">
                <AdminChart
                    usersCount={users.length}
                    servicesCount={services.length}
                    expertsCount={experts.length}
                    projectTypesCount={projectTypes.length}
                    subjectsCount={subjects.length}
                />
            </div>

            {/* Display users */}
            {/* <div className="w-full max-w-sm mx-auto md:max-w-none gap-4 mb-8">
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
                                    <td className="px-4 py-2 whitespace-nowrap">{user.id}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
}

export default AdminDashboard;
