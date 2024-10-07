import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function AllExperts() {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpert, setEditingExpert] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [notification, setNotification] = useState(null);
  const expertsPerPage = 6;
  const { currentUser, authToken } = useContext(UserContext);

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/experts")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.experts)) {
          setExperts(data.experts);
        } else {
          console.error("Expected 'experts' to be an array:", data);
          setExperts([]);
        }
      })
      .catch((error) => console.error("Error fetching experts:", error));
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

  const handleEditExpert = async (expertId) => {
    if (currentUser.username !== "admin_user") {
      alert("You do not have permission to edit experts.");
      return;
    }

    const token = authToken || localStorage.getItem("access_token");
    let profilePictureUrl = updatedValues.profile_picture;

    // If a new profile picture URL is provided, upload it to Cloudinary
    if (updatedValues.profile_picture instanceof File) {
      const formData = new FormData();
      formData.append("file", updatedValues.profile_picture);
      formData.append("upload_preset", "dlp71jbrz");

      // Upload to Cloudinary
      try {
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dlp71jbrz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadResponse.json();
        profilePictureUrl = uploadData.secure_url; // Get the secure URL
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return; // Exit the function if upload fails
      }
    }

    fetch(`http://127.0.0.1:5000/experts/${expertId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...updatedValues, profile_picture: profilePictureUrl }),
    })
      .then((response) => response.json())
      .then((updatedExpert) => {
        setExperts((prevExperts) =>
          prevExperts.map((expert) =>
            expert.id === expertId ? updatedExpert : expert
          )
        );
        fetchData();
        setNotification(`Expert updated successfully.`);
        setEditingExpert(null);
        setUpdatedValues({});
      })
      .catch((error) => console.error("Error updating expert:", error));
  };

  const handleUpdateChange = (e, field) => {
    if (field === 'profile_picture') {
      setUpdatedValues((prevValues) => ({
        ...prevValues,
        [field]: e.target.files[0], // Store the file object
      }));
    } else {
      setUpdatedValues((prevValues) => ({
        ...prevValues,
        [field]: e.target.value,
      }));
    }
  };

  const handleDeleteExpert = (expertId) => {
    if (currentUser.username !== "admin_user") {
      alert("You do not have permission to delete experts.");
      return;
    }

    const token = authToken || localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:5000/experts/${expertId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setExperts((prevExperts) =>
            prevExperts.filter((expert) => expert.id !== expertId)
          );
          setNotification("Expert deleted successfully.");
        } else {
          console.error("Error deleting expert:", response);
        }
      })
      .catch((error) => console.error("Error deleting expert:", error));
  };

  const cancelEdit = () => {
    fetchData();
    setEditingExpert(null);
    setUpdatedValues({});
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredExperts = (experts || []).filter((expert) =>
    expert.title ? expert.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {currentExperts.length === 0 ? (
          <div className="col-span-3 p-4 text-center">No experts available.</div>
        ) : (
          currentExperts.map((expert) => (
            <div
              key={expert.id}
              className="border p-4 flex flex-col justify-between shadow-xl rounded-lg overflow-hidden bg-white aos-init"
            >
              <div className="flex-grow">

                <div className="flex-grow border border-[#e4e4e4] h-[300px] mb-4 relative overflow-hidden group transition">
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-full h-full mx-auto flex justify-center items-center">
                      <img
                        src={expert.profilePicture}
                        alt={`${expert.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>


                <h2 className="font-bold text-lg mb-1 text-center">{expert.name}</h2>
                <h3 className="text-sm mb-2 text-gray-600 text-center">{expert.title}</h3>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Expertise:</span> {expert.expertise}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Description:</span> {expert.description}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Biography:</span> {expert.biography}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Education:</span> {expert.education}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Languages:</span> {expert.languages}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Project Type:</span> {expert.project_types}
                </p>
                <p className="mb-2 text-sm">
                  <span className="font-medium">Subjects:</span> {expert.subject}
                </p>
              </div>
              {currentUser.username === "admin_user" && (
                <div className="mt-4">
                  <div className="flex flex-row justify-between mb-2">
                    <button
                      onClick={() => {
                        setEditingExpert(expert.id);
                        setUpdatedValues({
                          name: expert.name,
                          description: expert.description,
                          biography: expert.biography,
                          education: expert.education,
                          languages: expert.languages,
                          project_types: expert.project_types,
                          subjects: expert.subjects,
                          profile_picture: expert.profile_picture,
                        });
                      }}
                      className="p-2 bg-[#85C4C2] text-white rounded-md"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleDeleteExpert(expert.id)}
                      className="p-2 bg-[#769594] text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>


      {/* Editing Section */}
      {editingExpert && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Expert</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditExpert(editingExpert);
              }}
            >
              <div className="flex flex-col mb-4">
                <label className="mb-2">Name:</label>
                <input
                  type="text"
                  value={updatedValues.name}
                  onChange={(e) => handleUpdateChange(e, 'name')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Profile Picture:</label>
                <input
                  type="file"
                  onChange={(e) => handleUpdateChange(e, 'profile_picture')}
                  className="border py-2 px-4 border-gray-300 rounded-md w-full"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Description:</label>
                <input
                  type="text"
                  value={updatedValues.description}
                  onChange={(e) => handleUpdateChange(e, 'description')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Biography:</label>
                <textarea
                  value={updatedValues.biography}
                  onChange={(e) => handleUpdateChange(e, 'biography')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Education:</label>
                <input
                  type="text"
                  value={updatedValues.education}
                  onChange={(e) => handleUpdateChange(e, 'education')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Languages:</label>
                <input
                  type="text"
                  value={updatedValues.languages}
                  onChange={(e) => handleUpdateChange(e, 'languages')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Project Types:</label>
                <input
                  type="text"
                  value={updatedValues.project_types}
                  onChange={(e) => handleUpdateChange(e, 'project_types')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="mb-2">Subjects:</label>
                <input
                  type="text"
                  value={updatedValues.subjects}
                  onChange={(e) => handleUpdateChange(e, 'subjects')}
                  className="p-2 border rounded-md"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button type="submit" className="p-2 bg-[#769594] text-white rounded-md">Save Changes</button>
                <button type="button" onClick={cancelEdit} className="p-2 bg-gray-400 text-white rounded-md">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && <div className="bg-[#85C4C2] p-4 mt-4">{notification}</div>}
    </div>
  );
}


