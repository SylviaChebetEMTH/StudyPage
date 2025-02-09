// import React, { useEffect, useState, useContext } from 'react';
// import { UserContext } from '../contexts/userContext';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

// const Projects = () => {
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState('');
//   const { authToken } = useContext(UserContext);

//   useEffect(() => {
//     // Fetch projects when the component loads
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5000/projects', {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setProjects(data);
//         } else {
//           const errorData = await response.json();
//           setError(errorData.error || 'Error fetching projects.');
//         }
//       } catch (err) {
//         setError('Failed to fetch projects.');
//         console.error(err);
//       }
//     };

//     fetchProjects();
//   }, [authToken]);

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-3xl font-bold text-center mb-8">Expert Dashboard</h1>
//       {error ? (
//         <div className="text-red-500 text-lg text-center mb-6">{error}</div>
//       ) : (
//         <div>
//           {projects.map((project, index) => (
//             <div key={index} className="mb-6 p-6 border-b border-gray-300">
//               {/* Project Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <div className="text-xl font-semibold">{project.project_title}</div>
//                 <div
//                   className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
//                     project.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'
//                   }`}
//                 >
//                   {project.status}
//                 </div>
//               </div>

//               {/* Project Details */}
//               <div className="text-sm text-gray-700 mb-4">
//                 <p><strong>Client:</strong> {project.client_name}</p>
//                 <p><strong>Expert:</strong> {project.expert_name}</p>
//                 <p><strong>Description:</strong> {project.project_description}</p>
//                 <p><strong>Deadline:</strong> {project.deadline}</p>
//                 <p><strong>Pages:</strong> {project.number_of_pages}</p>
//                 <p><strong>Budget:</strong> ${project.budget}</p>
//               </div>

//               {/* Progress Bar */}
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//                 <div
//                   className="bg-green-500 h-2 rounded-full"
//                   style={{ width: `${project.progress}%` }}
//                 ></div>
//               </div>
//               <p><strong>Progress:</strong> {project.progress}%</p>

//               {/* Project Actions */}
//               <div className="flex justify-between items-center mt-4">
//                 <button className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-blue-700">
//                   <FontAwesomeIcon icon={faEye} /> View
//                 </button>
//                 <button className="bg-yellow-600 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-yellow-700">
//                   <FontAwesomeIcon icon={faEdit} /> Edit
//                 </button>
//                 <button className="bg-red-600 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-red-700">
//                   <FontAwesomeIcon icon={faTrash} /> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Projects;



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
        const response = await fetch('https://studypage.onrender.com/projects', {
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
