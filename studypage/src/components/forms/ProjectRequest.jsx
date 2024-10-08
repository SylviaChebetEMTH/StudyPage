import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';

const ProjectRequest = () => {
  const { authToken } = useContext(UserContext); 
  const { state } = useLocation(); // Retrieve the state passed from the ExpertPage
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [notification, setNotification] = useState(null);
  const [expertId, setExpertId] = useState(state ? state.expertId : ''); // Set the expertId from state

  useEffect(() => {
    fetch('http://127.0.0.1:5000/project-types')
      .then((response) => response.json())
      .then((data) => setProjectTypes(data))
      .catch((error) => console.error('Error fetching project types:', error));
  }, []);

  // Fetch subjects from API
  useEffect(() => {
    fetch('http://127.0.0.1:5000/subjects')
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error('Error fetching subjects:', error));
  }, []);

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!projectTitle || !description || !selectedProjectType || !selectedSubject || !deadline || !expertId) {
      alert("Please fill in all the required fields.");
      return;
    }
  
    if (attachments.length === 0) {
      alert("Please attach at least one file.");
      return;
    }
  
    // Create form data to handle file attachments
    const formData = new FormData();
    formData.append('project_title', projectTitle);
    formData.append('project_description', description);
    formData.append('project_type', selectedProjectType);
    formData.append('subject', selectedSubject);
    formData.append('deadline', deadline);
    formData.append('expert_id', expertId); // Include the expertId
    
    // Attach all selected files
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
  
    // Log the form data for debugging
    console.log('Form Data:', formData);
  
    // Retrieve the JWT token from context
     // Access the token from context
    if (!authToken) {
      console.error("No token found in context.");
      alert("You must be logged in to submit a project request.");
      return;
    }
  
    // Submit the form data to the server
    fetch('http://127.0.0.1:5000/request_expert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData, // FormData handles file and text fields
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit the project request.");
        }
        return response.json();
      })
      .then((data) => {
        console.log('Project request submitted:', data);
        if (data.msg) {
          alert(data.msg);  // Alert message from server
        } else {
          setNotification(`Expert updated successfully.`);
          alert("Project request submitted successfully.");
        }
      })
      .catch((error) => {
        console.error('Error submitting project request:', error);
        alert("There was an error submitting the project request. Please try again.");
      });
  };
  
  

  return (
    <div className="container mx-auto p-8 bg-gray-300 shadow-md rounded-lg max-w-4xl m-6">
      <h2 className="text-2xl font-bold mb-4">Request Expert</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium">Project Title</label>
          <input
            type="text"
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
          <select
            id="projectType"
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
            required
          >
            <option value="">Select Project Type</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="attachments" className="block text-sm font-medium">Attachments</label>
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700 font-extralight"
            required
          />
        </div>

        <button type="submit" className="mt-4 bg-[#769594] text-white p-2 rounded">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default ProjectRequest;
