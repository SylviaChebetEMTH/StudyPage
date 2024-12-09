import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/userContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const { authToken } = useContext(UserContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/projects', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error fetching projects.');
        }
      } catch (err) {
        setError('Failed to fetch projects.');
        console.error(err);
      }
    };

    fetchProjects();
  }, [authToken]);

  const handleDoProject = async (projectId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedProject(data); // Show project details in modal
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error fetching project details.');
      }
    } catch (err) {
      setError('Failed to fetch project details.');
    }
  };

  const handleSubmitWork = async (formData, projectId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/projects/${projectId}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData, // Includes files and comments
      });

      if (response.ok) {
        alert('Work submitted successfully!');
        setSelectedProject(null); // Close modal
      } else {
        alert('Error submitting work');
      }
    } catch (err) {
      console.error('Error submitting work:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Expert Dashboard</h1>
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.id} style={styles.project}>
              <div style={styles.projectTitle}>{project.project_title}</div>
              <button
                style={styles.button}
                onClick={() => handleDoProject(project.project_id)}
              >
                Do Project
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div style={styles.modal}>
          <h2>{selectedProject.project_title}</h2>
          <p>{selectedProject.project_description}</p>
          <p>Deadline: {selectedProject.deadline}</p>
          <a href={`http://127.0.0.1:5000/uploads/${selectedProject.attachments}`} download>
            Download Attachments
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSubmitWork(formData, selectedProject.id);
            }}
          >
            <textarea
              name="comments"
              placeholder="Enter your comments"
              style={styles.textarea}
            ></textarea>
            <input type="file" name="attachments" multiple />
            <button type="submit" style={styles.submitButton}>
              Submit Work
            </button>
          </form>

          <button style={styles.closeButton} onClick={() => setSelectedProject(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  project: {
    marginBottom: '20px',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  projectTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  projectDetails: {
    fontSize: '14px',
    color: '#555',
  },
  error: {
    color: 'red',
    fontSize: '16px',
  },
};

export default Projects;
