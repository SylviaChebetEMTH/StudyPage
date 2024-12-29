import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/userContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const { authToken } = useContext(UserContext);

  useEffect(() => {
    // Fetch projects when the component loads
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/projects', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace with your token
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

  return (
    <div style={styles.container}>
      <h1>Expert Dashboard</h1>
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div>
          {projects.map((project, index) => (
            <div key={index} style={styles.project}>
              <div style={styles.projectTitle}>{project.project_title}</div>
              <div style={styles.projectDetails}>
                <p>Client: {project.client_name}</p>
                <p>Expert: {project.expert_name}</p>
                <p>Description: {project.project_description}</p>
                <p>Deadline: {project.deadline}</p>
                <p>Pages: {project.number_of_pages}</p>
              </div>
            </div>
          ))}
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
