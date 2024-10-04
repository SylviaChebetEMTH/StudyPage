import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function AllServices() {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingService, setEditingService] = useState(null);
    const [updateValues, setUpdateValues] = useState({
        title: "",
        description: "",
        price: "",
    });
    const [notification, setNotification] = useState(null);
    const servicesPerPage = 6;
    const { currentUser, authToken } = useContext(UserContext);

    // Fetch services from backend
    const fetchData = () => {
        fetch("http://127.0.0.1:5000/services")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.services)) {
                    setServices(data.services);
                } else {
                    console.error("Expected 'services' to be an array:", data);
                    setServices([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
                setNotification("Error fetching services. Please try again later.");
            });
    };

    // Fetch a specific unit of service (if applicable)
    const fetchUnit = (serviceId) => {
        fetch(`http://127.0.0.1:5000/services/${serviceId}/unit`) 
            .then((response) => response.json())
            .then((data) => {
                // Handle the fetched unit data
                console.log("Unit data:", data);
                // Add additional logic as necessary
            })
            .catch((error) => {
                console.error("Error fetching service unit:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleEditService = (serviceId) => {
        if (currentUser.username !== "admin_user") {
            alert("You do not have permission to edit services.");
            return;
        }

        const token = authToken || localStorage.getItem("access_token");
        fetch(`http://127.0.0.1:5000/services/${serviceId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateValues),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update service");
                return response.json();
            })
            .then((updatedService) => {
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? updatedService : service
                    )
                );
                fetchData();
                setNotification(`Service updated successfully.`);
                setEditingService(null);
                setUpdateValues({ title: "", description: "", price: "" });
            })
            .catch((error) => {
                console.error("Error updating service:", error);
                setNotification("Error updating service. Please try again.");
            });
    };

    const handleDeleteService = (serviceId) => {
        if (currentUser.username !== "admin_user") {
            alert("You do not have permission to delete services.");
            return;
        }

        const token = authToken || localStorage.getItem("access_token");
        fetch(`http://127.0.0.1:5000/services/${serviceId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to delete service");
                setServices((prevServices) =>
                    prevServices.filter((service) => service.id !== serviceId)
                );
                setNotification("Service deleted successfully.");
            })
            .catch((error) => {
                console.error("Error deleting service:", error);
                setNotification("Error deleting service. Please try again.");
            });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleUpdateSubmit = (serviceId) => {
        handleEditService(serviceId);
    };

    const filteredServices = (services || []).filter((service) =>
        service.title ? service.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(
        indexOfFirstService,
        indexOfLastService
    );

    return (
        <div className="bg-white p-4 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-center md:flex-1 space-y-4 md:space-y-0 md:space-x-4">
                    <h1 className="text-xl font-bold md:flex-1">All Services</h1>
                    <div className="relative flex-shrink-0 w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={handleUpdateChange} // Handle search as well
                            className="p-2 border rounded-md w-full"
                        />
                    </div>

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border rounded-md md:w-1/3"
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="description">Sort by Description</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentServices.length === 0 ? (
                    <div className="col-span-3 p-4 text-center">No services available.</div>
                ) : (
                    currentServices.map((service) => (
                        <div key={service.id} className="bg-white border rounded-md shadow-md p-4 hover:shadow-lg transition-shadow">
                            <h2 className="font-bold text-lg mb-2">{service.title}</h2>
                            <p className="mb-2">{service.description}</p>
                            <p className="text-xl font-semibold">${service.price.toFixed(2)}</p>
                            <div className="mt-4">
                                {currentUser.username === "admin_user" && ( 
                                    <>
                                        <div className="flex flex-row justify-between gap-4 mb-2">
                                            <button
                                                onClick={() => {
                                                    setEditingService({ id: service.id });
                                                    setUpdateValues({
                                                        title: service.title,
                                                        description: service.description,
                                                        price: service.price,
                                                    });
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="flex flex-row justify-between gap-4">
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="bg-red-500 text-white px-4 py-1 rounded-md"
                                            >
                                                Delete Service
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {editingService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Edit Service</h3>
                        <input
                            type="text"
                            name="title"
                            value={updateValues.title}
                            onChange={handleUpdateChange}
                            className="border p-2 rounded-md mb-2 w-full"
                            placeholder="Enter new title"
                        />
                        <textarea
                            name="description"
                            value={updateValues.description}
                            onChange={handleUpdateChange}
                            className="border p-2 rounded-md mb-2 w-full"
                            placeholder="Enter new description"
                        />
                        <input
                            type="number"
                            name="price"
                            value={updateValues.price}
                            onChange={handleUpdateChange}
                            className="border p-2 rounded-md mb-4 w-full"
                            placeholder="Enter new price"
                        />
                        <button
                            onClick={() => handleUpdateSubmit(editingService.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Update Service
                        </button>
                        <button
                            onClick={() => setEditingService(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {notification && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded-md">
                    {notification}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="bg-gray-300 p-2 rounded-md mr-2"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="bg-gray-300 p-2 rounded-md"
                    disabled={currentPage === Math.ceil(filteredServices.length / servicesPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
