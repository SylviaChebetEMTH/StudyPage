import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './contexts/userContext';
import { Link } from 'react-router-dom';

const ExpertPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { currentUser } = useContext(UserContext);

  const API_URL = 'http://127.0.0.1:5000';

  // Function to fetch experts from backend
  const fetchExperts = async () => {
    try {
      const response = await fetch(`${API_URL}/experts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Log to verify structure
      setExperts(Array.isArray(data.experts) ? data.experts : []); // Access 'experts' from the response
    } catch (error) {
      console.error('Error fetching experts:', error);
      setError('Failed to fetch experts.');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful upload
  const handleUploadSuccess = (filename) => {
    console.log('Upload successful, filename:', filename);
    fetchExperts();
  };

  // Handle hiring an expert
  const hireExpert = (expertId) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      console.log(`Hiring expert with ID: ${expertId}`);
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Login Required</h2>
            <p className="mb-4 text-center">You need to log in to hire an expert.</p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Link
                to="/login"
                className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 text-center"
              >
                Log In
              </Link>
              <button
                onClick={closeLoginPrompt}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Experts List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(experts) && experts.length > 0 ? (
          experts.map((expert) => (
            <div
              key={expert.id}
              className="bg-slate-300 shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={`${expert.profilePicture}`}
                alt="Profile"
                className="w-40 h-40 mx-auto rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold mb-2">{expert.name}</h2>
              <p className="text-gray-700">Title: {expert.title}</p>
              <p className="text-gray-700">Email: {expert.email}</p>
              <p className="text-gray-700">Phone: {expert.phone_number}</p>
              {expert.biography && (
                <p className="text-gray-700">Biography: {expert.biography}</p>
              )}
              {expert.education && (
                <p className="text-gray-700">Education: {expert.education}</p>
              )}
              {expert.languages && (
                <p className="text-gray-700">Languages: {expert.languages}</p>
              )}
              {expert.project_types && (
                <p className="text-gray-700">Project Types: {expert.project_types}</p>
              )}
              {expert.subjects && (
                <p className="text-gray-700">Subjects: {expert.subjects}</p>
              )}
              {/* Hire Expert Button */}
              <button
                onClick={() => hireExpert(expert.id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Hire Expert
              </button>
            </div>
          ))
        ) : (
          <p>No experts available</p>
        )}
      </div>
    </div>
  );
};

export default ExpertPage;
