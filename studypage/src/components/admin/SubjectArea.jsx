import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';  // Assuming you have a user context for roles

function SubjectArea() {
  const { currentUser } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch subjects from the server
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Create a new subject
  const handleCreateSubject = async () => {
    if (newSubject.trim() === "") return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/subjects', {
        name: newSubject
      });
      setSubjects([...subjects, response.data]);
      setNewSubject("");  // Clear input field after adding
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  // Update an existing subject
  const handleUpdateSubject = async (id) => {
    if (editName.trim() === "") return;

    try {
      const response = await axios.put(`http://127.0.0.1:5000/subjects/${id}`, {
        name: editName
      });
      setSubjects(
        subjects.map((subject) => (subject.id === id ? response.data : subject))
      );
      setEditingSubject(null);  // Exit editing mode
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  // Delete a subject
  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/subjects/${id}`);
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Subjects</h1>

      {/* Only show this section to admin users */}
      {currentUser?.is_admin && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Add New Subject</h2>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="border p-2 rounded-md w-full mb-2"
            placeholder="Enter subject name"
          />
          <button
            onClick={handleCreateSubject}
            className="bg-[#769594] text-white px-4 py-2 rounded-md"
          >
            Add Subject
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold">Subjects List</h2>
      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li key={subject.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow">
            {editingSubject === subject.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-2 rounded-md flex-grow"
                placeholder="Edit subject name"
              />
            ) : (
              <span>{subject.name}</span>
            )}

            {currentUser?.is_admin && (
              <div className="flex space-x-2">
                {editingSubject === subject.id ? (
                  <button
                    onClick={() => handleUpdateSubject(subject.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingSubject(subject.id);
                      setEditName(subject.name);
                    }}
                    className="bg-[#85C4C2] text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDeleteSubject(subject.id)}
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

export default SubjectArea;
