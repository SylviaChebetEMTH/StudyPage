import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';  

function ProjectTypes() {
  const { currentUser } = useContext(UserContext);
  const [projectTypes, setProjectTypes] = useState([]);
  const [newProjectType, setNewProjectType] = useState("");
  const [editingProjectType, setEditingProjectType] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch project types from the server
  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/project-types');
      setProjectTypes(response.data);
    } catch (error) {
      console.error("Error fetching project types:", error);
    }
  };

  // Create a new project type
  const handleCreateProjectType = async () => {
    if (newProjectType.trim() === "") return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/project-types', {
        name: newProjectType
      });
      setProjectTypes([...projectTypes, response.data]);
      setNewProjectType("");  // Reset input field
    } catch (error) {
      console.error("Error creating project type:", error);
    }
  };

  // Update an existing project type
  const handleUpdateProjectType = async (id) => {
    if (editName.trim() === "") return;

    try {
      const response = await axios.put(`http://127.0.0.1:5000/project-types/${id}`, {
        name: editName
      });
      setProjectTypes(
        projectTypes.map((pt) => (pt.id === id ? response.data : pt))
      );
      setEditingProjectType(null);  // Exit editing mode
    } catch (error) {
      console.error("Error updating project type:", error);
    }
  };

  // Delete a project type
  const handleDeleteProjectType = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/project-types/${id}`);
      setProjectTypes(projectTypes.filter((pt) => pt.id !== id));
    } catch (error) {
      console.error("Error deleting project type:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Project Types</h1>

      {/* Only show this section to admin users */}
      {currentUser?.is_admin && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Add New Project Type</h2>
          <input
            type="text"
            value={newProjectType}
            onChange={(e) => setNewProjectType(e.target.value)}
            className="border p-2 rounded-md w-full mb-2"
            placeholder="Enter project type name"
          />
          <button
            onClick={handleCreateProjectType}
            className="bg-[#769594] text-white px-4 py-2 rounded-md"
          >
            Add Project Type
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold">Project Types List</h2>
      <ul className="space-y-2">
        {projectTypes.map((projectType) => (
          <li key={projectType.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow">
            {editingProjectType === projectType.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2 rounded-md flex-grow"
                placeholder="Edit project type name"
              />
            ) : (
              <span>{projectType.name}</span>
            )}

            {currentUser?.is_admin && (
              <div className="flex space-x-2">
                {editingProjectType === projectType.id ? (
                  <button
                    onClick={() => handleUpdateProjectType(projectType.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingProjectType(projectType.id);
                      setEditName(projectType.name);
                    }}
                    className="bg-[#85C4C2] text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDeleteProjectType(projectType.id)}
                  className="bg-[#769594] text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTypes;
