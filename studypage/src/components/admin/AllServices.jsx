import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function AllServices() {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [editingService, setEditingService] = useState(null);
    const [updateValue, setUpdateValue] = useState("");
    const [updateTitle, setUpdateTitle] = useState("");
    const [updatePrice, setUpdatePrice] = useState("");
    const [notification, setNotification] = useState(null);
    const servicesPerPage = 6;
    const { currentUser, authToken } = useContext(UserContext);

    const fetchData = () => {
        fetch("http://127.0.0.1:5000/services") // Ensure the correct backend route is used
            .then((response) => response.json())
            .then((data) => {
                // Adjusted the data handling to extract the services array from the response object
                if (Array.isArray(data.services)) {
                    setServices(data.services);
                } else {
                    console.error("Expected 'services' to be an array:", data);
                    setServices([]);
                }
            })
            .catch((error) => console.error("Error fetching services:", error));
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
            body: JSON.stringify({ description: updateValue }),
        })
            .then((response) => response.json())
            .then((updatedService) => {
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? updatedService : service
                    )
                );
                fetchData();
                setNotification(`Service description updated to ${updateValue}`);
                setEditingService(null);
                setUpdateValue("");
            })
            .catch((error) => console.error("Error updating service:", error));
    };

    const handleEditTitle = (serviceId) => {
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
            body: JSON.stringify({ title: updateTitle }), // Ensure title is sent for update
        })
            .then((response) => response.json())
            .then((updatedService) => {
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? updatedService : service
                    )
                );
                fetchData();
                setNotification(`Service title updated to "${updateTitle}"`);
                setEditingService(null);
                setUpdateTitle(""); // Reset title input
            })
            .catch((error) => console.error("Error updating title:", error));
    };

    const handleEditPrice = (serviceId) => {
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
            body: JSON.stringify({ price: parseFloat(updatePrice) }),
        })
            .then((response) => response.json())
            .then((updatedService) => {
                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.id === serviceId ? updatedService : service
                    )
                );
                fetchData();
                setNotification(`Service price updated to $${updatePrice}`);
                setEditingService(null);
                setUpdatePrice("");
            })
            .catch((error) => console.error("Error updating price:", error));
    };

    const handleUpdateChange = (e) => {
        setUpdateValue(e.target.value);
    };

    const handleTitleChange = (e) => {
        setUpdateTitle(e.target.value);
    };

    const handlePriceChange = (e) => {
        setUpdatePrice(e.target.value);
    };

    const handleUpdateSubmit = (serviceId) => {
        if (editingService) {
            if (editingService.action === "description") {
                handleEditService(serviceId);
            } else if (editingService.action === "title") {
                handleEditTitle(serviceId);
            } else if (editingService.action === "price") {
                handleEditPrice(serviceId);
            }
        }
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
                if (response.ok) {
                    setServices((prevServices) =>
                        prevServices.filter((service) => service.id !== serviceId)
                    );
                    setNotification("Service deleted successfully.");
                } else {
                    console.error("Error deleting service:", response);
                }
            })
            .catch((error) => console.error("Error deleting service:", error));
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (e) => {
        setSortOption(e.target.value);
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
                            onChange={handleSearch}
                            className="p-2 border rounded-md w-full"
                        />
                    </div>

                    <select
                        value={sortOption}
                        onChange={handleSort}
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
                                                    setEditingService({ id: service.id, action: "title" });
                                                    setUpdateTitle(service.title);
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                            >
                                                Edit Title
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingService({ id: service.id, action: "description" });
                                                    setUpdateValue(service.description);
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                                            >
                                                Edit Description
                                            </button>

                                        </div>
                                        <div className="flex flex-row justify-between gap-4">
                                            <button
                                                onClick={() => {
                                                    setEditingService({ id: service.id, action: "price" });
                                                    setUpdatePrice(service.price);
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            >
                                                Edit Price
                                            </button>
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
                        <h3 className="text-lg font-bold mb-4">
                            {editingService.action === "title"
                                ? "Edit Service Title"
                                : editingService.action === "description"
                                    ? "Edit Service Description"
                                    : "Edit Service Price"}
                        </h3>
                        {editingService.action === "title" && (
                            <input
                                type="text"
                                value={updateTitle}
                                onChange={handleTitleChange}
                                className="border p-2 rounded-md mb-4 w-full"
                                placeholder="Enter new title"
                            />
                        )}
                        {editingService.action === "description" && (
                            <textarea
                                value={updateValue}
                                onChange={handleUpdateChange}
                                className="border p-2 rounded-md mb-4 w-full"
                                placeholder="Enter new description"
                            />
                        )}
                        {editingService.action === "price" && (
                            <input
                                type="number"
                                value={updatePrice}
                                onChange={handlePriceChange}
                                className="border p-2 rounded-md mb-4 w-full"
                                placeholder="Enter new price"
                            />
                        )}
                        <button
                            onClick={() => handleUpdateSubmit(editingService.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                        >
                            Save
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
                <div className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-md shadow-md z-50">
                    {notification}
                </div>
            )}
        </div>
    );
}
