import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/userContext';

const ProjectSummary = () => {
    const { authToken } = useContext(UserContext);
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the user's project requests when the component mounts
        const fetchRequests = async () => {
            try {
                // const token = localStorage.getItem('jwt_token'); // Assuming JWT is stored in localStorage
                const response = await fetch('https://studypage-76hu.onrender.com/my_requests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}` // Sending the JWT in the Authorization header
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch project requests');
                }

                const data = await response.json();
                if (data.data) {
                    setRequests(data.data); // Set the fetched requests data
                } else {
                    setError(data.msg); // Set error message if no data
                }
            } catch (err) {
                setError('An error occurred while fetching data');
                console.error(err);
            }
        };

        fetchRequests();
    }, [authToken]);

    return (
        <div>
            <h1>Your Project Requests</h1>

            {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}

            {requests.length === 0 ? (
                <p>You have no project requests yet.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((request, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{request.project_title}</h2>
                            <p><strong>Description:</strong> {request.project_description}</p>
                            <p><strong>Project Type:</strong> {request.project_type}</p>
                            <p><strong>Subject:</strong> {request.subject}</p>
                            <p><strong>Expert:</strong> {request.expert}</p>
                            <p><strong>Deadline:</strong> {request.deadline}</p>
                            <p><strong>Number of Pages:</strong> {request.number_of_pages}</p>
                            <div>
                                <strong>Attachments:</strong>
                                <ul>
                                    {request.attachments.length > 0 ? (
                                        request.attachments.map((file, idx) => (
                                            <li key={idx}>
                                                <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                                                    {file}
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No attachments</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectSummary;
