import React, { useState, useEffect } from 'react';

const ProjectRequest = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [expertId, setExpertId] = useState('');


  // Fetch project types from API
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create form data to handle file attachments
    const formData = new FormData();
    formData.append('project_title', projectTitle);
    formData.append('description', description);
    formData.append('project_type', selectedProjectType);
    formData.append('subject', selectedSubject);
    formData.append('deadline', deadline);
  
    // Append expert_id (ensure you have the expert_id value from somewhere, e.g., user selection)
    formData.append('expert_id', expertId); // Replace expertId with the actual expert id
  
    // Attach all selected files
    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }
  
    // Retrieve the JWT token from local storage or context
    const token = localStorage.getItem('jwtToken');
  
    // Submit the form data to the server
    fetch('http://127.0.0.1:5000/request_expert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Project request submitted:', data);
        // Handle successful submission (e.g., clear the form or show a success message)
      })
      .catch((error) => {
        console.error('Error submitting project request:', error);
      });
  };

  

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Submit a Project Request</h2>
      <form onSubmit={handleSubmit}>
        {/* Project Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectTitle">
            Project Title
          </label>
          <input
            type="text"
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Brief Description */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Brief Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Project Type Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectType">
            Project Type
          </label>
          <select
            id="projectType"
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Project Type</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Attachments */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachments">
            Attachments
          </label>
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>

        {/* Deadline Calendar */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Project Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectRequest;
