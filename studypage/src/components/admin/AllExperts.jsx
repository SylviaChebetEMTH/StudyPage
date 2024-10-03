import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function AllExperts() {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpert, setEditingExpert] = useState(null);
  const [updateValue, setUpdateValue] = useState("");
  const [notification, setNotification] = useState(null);
  const expertsPerPage = 6;
  const { currentUser, authToken } = useContext(UserContext);

  // Function to fetch expert data
  const fetchData = () => {
    fetch("http://127.0.0.1:5000/experts")
      .then((response) => response.json())
      .then((data) => {
        setExperts(data.experts);
      })
      .catch((error) => console.error("Error fetching experts:", error));
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  useEffect(() => {
    if (notification) {
      // Set up a timer to clear the notification after 2 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle expertise level update
  const handleEditExpertise = (expertId) => {
    if (currentUser.username !== "admin") {
      alert("You do not have permission to edit expertise.");
      return;
    }

    const token = authToken || localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:5000/experts/${expertId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expertise: updateValue }),
    })
      .then((response) => response.json())
      .then((updatedExpert) => {
        setExperts((prevExperts) =>
          prevExperts.map((expert) =>
            expert.id === expertId ? updatedExpert : expert
          )
        );
        setNotification(`Expertise updated to ${updateValue}`);
        setEditingExpert(null);
        setUpdateValue("");
        fetchData(); // Refresh the expert list
      })
      .catch((error) => console.error("Error updating expertise:", error));
  };

  // Handle input changes for update
  const handleUpdateChange = (e) => {
    setUpdateValue(e.target.value);
  };

  // Handle form submission for updates
  const handleUpdateSubmit = (expertId) => {
    if (editingExpert) {
      if (editingExpert.action === "expertise") {
        handleEditExpertise(expertId);
      }
    }
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting option changes
  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  // Filter and sort experts
  const filteredExperts = experts
    .filter((expert) =>
      expert.name
        ? expert.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
    .sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "expertise") return a.expertise.localeCompare(b.expertise);
      return 0;
    });

  // Pagination logic
  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = filteredExperts.slice(
    indexOfFirstExpert,
    indexOfLastExpert
  );

  return (
    <div className="bg-white p-4 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:flex-1 space-y-4 md:space-y-0 md:space-x-4">
          <h1 className="text-xl font-bold md:flex-1">All Experts</h1>
          <div className="relative flex-shrink-0 w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search experts..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border rounded-md w-full"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.78-5.61A7.5 7.5 0 1112 5a7.5 7.5 0 015.61 1.78z"
                ></path>
              </svg>
            </span>
          </div>

          <select
            value={sortOption}
            onChange={handleSort}
            className="p-2 border rounded-md md:w-1/3"
          >
            <option value="newest">Sort by Newest</option>
            <option value="expertise">Sort by Expertise</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {currentExperts.map((expert) => (
          <div key={expert.id} className="p-4 border rounded-md">
            <div className="w-[300px] mx-auto flex justify-center items-center">
              <img
                src={expert.image || "https://via.placeholder.com/150"}
                alt={expert.name}
                className="max-h-[300px] h-[300px] object-cover"
              />
            </div>

            <h2 className="font-semibold mt-2">{expert.name}</h2>
            <p className="text-gray-600">{expert.expertise}</p>

            <div className="flex justify-between items-center mt-2">
              {currentUser.username === "admin" && (
                <button
                  onClick={() => {
                    setEditingExpert({
                      id: expert.id,
                      action: "expertise",
                    });
                    setUpdateValue(expert.expertise);
                  }}
                  className="bg-[#7C7C7C] text-white px-4 py-2 rounded-md"
                >
                  Edit Expertise
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingExpert && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-2">
              {editingExpert.action === "expertise"
                ? "Update Expertise"
                : ""}
            </h3>
            {editingExpert.action === "expertise" && (
              <div>
                <label className="block mb-2">New Expertise:</label>
                <input
                  type="text"
                  value={updateValue}
                  onChange={handleUpdateChange}
                  className="p-2 border rounded-md w-full mb-2"
                />
                <button
                  onClick={() => handleUpdateSubmit(editingExpert.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Previous</button>
        <span className="mx-2">Page {currentPage}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * expertsPerPage >= experts.length} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Next</button>
      </div>
    </div>
  );
}
