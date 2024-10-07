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
        project_type_name: "",
        subject_name: ""
    });
    const [notification, setNotification] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const servicesPerPage = 20;
    const { currentUser, authToken } = useContext(UserContext);

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

    useEffect(() => {
        const fetchProjectTypes = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/project-types", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
    
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Error response:", errorText);
              throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            setProjectTypes(data); // Set the fetched project types to the state
          } catch (error) {
            console.error("Error fetching project types:", error);
          }
        };
    
        const fetchSubjects = async () => {
          try {
            const response = await fetch("http://127.0.0.1:5000/subjects", { // Adjust endpoint as needed
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
    
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Error response:", errorText);
              throw new Error("Network response was not ok");
            }
    
            const data = await response.json();
            setSubjects(data); // Set the fetched subjects to the state
          } catch (error) {
            console.error("Error fetching subjects:", error);
          }
        };
        fetchData();
        fetchProjectTypes();
        fetchSubjects(); // Fetch subjects when the component mounts
      }, [authToken]);
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
                setUpdateValues({ title: "", description: "", price: "", subject_name: "", project_type_name: "" });
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

    // const handleUpdateChange = (e) => {
    //     const { name, value } = e.target;
    //     setUpdateValues((prevValues) => ({ ...prevValues, [name]: value }));
    // };
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleUpdateSubmit = (serviceId) => {
        handleEditService(serviceId);
    };

    const filteredServices = (services || []).filter((service) =>
        service.title ? service.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    return (
        <div className="bg-white p-4 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-xl font-bold">All Services</h1>
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="description">Sort by Description</option>
                    </select>
                </div>
            </header>

            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Title</th>
                        <th className="py-2 px-4 border">Description</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Subject Area</th>
                        <th className="py-2 px-4 border">Project Type</th>
                        {currentUser.username === "admin_user" && (
                            <>
                                <th className="py-2 px-4 border">Edit</th>
                                <th className="py-2 px-4 border">Delete</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentServices.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No services available.
                            </td>
                        </tr>
                    ) : (
                        currentServices.map((service) => (
                            <tr key={service.id}>
                                <td className="py-2 px-4 border">{service.title}</td>
                                <td className="py-2 px-4 border">{service.description}</td>
                                <td className="py-2 px-4 border">${service.price.toFixed(2)}</td>
                                <td className="py-2 px-4 border">{service.subject_name}</td>
                                <td className="py-2 px-4 border">{service.project_type_name}</td>
                                {currentUser.username === "admin_user" && (
                                    <>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => {
                                                    setEditingService({ id: service.id });
                                                    setUpdateValues({
                                                        title: service.title,
                                                        description: service.description,
                                                        price: service.price,
                                                        subject_name: service.subject_name,
                                                        project_type_name: service.project_type_name,
                                                    });
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editingService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Edit Service</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateSubmit(editingService.id);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={updateValues.title}
                                    onChange={handleUpdateChange}
                                    required
                                    className="p-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={updateValues.description}
                                    onChange={handleUpdateChange}
                                    required
                                    className="p-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={updateValues.price}
                                    onChange={handleUpdateChange}
                                    required
                                    className="p-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Subject Area</label>
                                <select
                                    name="subject_name"
                                    value={updateValues.subject_name}
                                    onChange={handleUpdateChange}
                                    required
                                    className="p-2 border rounded-md w-full"
                                >
                                    <option value="">Select Subject Area</option>
                                    {subjects.length > 0 ? (
                                        subjects.map((subject) => (
                                            <option key={subject.id} value={subject.name}>
                                                {subject.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading subject areas...</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Project Type</label>
                                <select
                                    name="project_type_name"
                                    value={updateValues.project_type_name}
                                    onChange={handleUpdateChange}
                                    required
                                    className="p-2 border rounded-md w-full"
                                >
                                    <option value="">Select Project Type</option>
                                    {projectTypes.length > 0 ? (
                                        projectTypes.map((project) => (
                                            <option key={project.id} value={project.name}>
                                                {project.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading project types...</option>
                                    )}
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setEditingService(null)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Update Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {notification && (
                <div className="fixed top-0 right-0 m-4 bg-red-500 text-white p-2 rounded-md">
                    {notification}
                </div>
            )}
        </div>
    );
}

