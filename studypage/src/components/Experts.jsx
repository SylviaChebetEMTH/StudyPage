// import React, { useEffect, useState, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { UserContext } from './contexts/userContext';
// import ExpertCard from './ExpertCard';
// import ClipLoader from 'react-spinners/ClipLoader';

// const ExpertSelectionPage = () => {
//   const [experts, setExperts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { currentUser } = useContext(UserContext);
//   const location = useLocation();
//   const API_URL = 'https://studypage.onrender.com';

//   // Extract the selected project type and subject from history/state
//   // const { projectTypeId, subjectId } = location.state || {};
//   const projectTypeId = localStorage.getItem("selectedProjectTypeId");
//   const subjectId = localStorage.getItem("selectedSubjectId");
//   const serviceId = localStorage.getItem("serviceId");
//   console.log('projecttype',projectTypeId)
//   console.log('subject id retrieved',subjectId)
//   console.log('service id retrieved',serviceId)

//   useEffect(() => {
//     if (!projectTypeId) {
//       setError('Invalid request. No selection history found.');
//       setLoading(false);
//       return;
//     }

//     const fetchExperts = async () => {
//       try {
//         const response = await fetch(`${API_URL}/experts/search?service_id=${serviceId}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch experts');
//         }
        
//         const data = await response.json();
//         console.log("API Response:", data); // Debugging
    
//         if (!data.experts || data.experts.length === 0) {
//           throw new Error("No experts available for this category.");
//         }
    
//         setExperts(data.experts); // ✅ Set the experts array properly
//       } catch (error) {
//         console.error("Error fetching experts:", error.message);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExperts();
//   }, [projectTypeId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ClipLoader size={60} color={'#4A90E2'} />
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-center text-red-500">{error}</p>;
//   }

//   return (
//     <div className="p-0">
//       <div className="bg-slate-200 min-h-screen">
//         <div className="relative h-64 sm:h-[400px] mb-4 bg-cover bg-center" style={{ backgroundImage: "url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg)", }}>
//           <div className="absolute inset-0 bg-black opacity-50"></div>
//           <div className=" relative z-10 text-center p-8">
//             <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">
//               Choose an Expert
//             </h1>
//             <p className="text-sm sm:text-lg text-white max-w-xl mx-auto mb-6">
//             Most of our experts are lecturers and teachers from various institutions, offering their expertise as freelance professionals.
//             </p>
//           </div>
//         </div>
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-2">Available Experts</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//           {experts.length > 0 ? (
//             experts.map((expert) => (
//               <ExpertCard key={expert.id} expert={expert} onHire={() => navigate('/userprofile/hireexpert', { state: { expertId: expert.id } })} />
//             ))
//           ) : (
//             <p className="text-center">No experts found matching your selection</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpertSelectionPage;




import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './contexts/userContext';
import ExpertCard from './ExpertCard';
import ClipLoader from 'react-spinners/ClipLoader';

const ExpertSelectionPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const location = useLocation();
  const API_URL = 'https://studypage-76hu.onrender.com';
  
  // Extract the selected project type and subject from history/state
  // const { projectTypeId, subjectId } = location.state || {};
  const projectTypeId = localStorage.getItem("selectedProjectTypeId");
  const subjectId = localStorage.getItem("selectedSubjectId");
  const serviceId = localStorage.getItem("serviceId");
  console.log('projecttype',projectTypeId)
  console.log('subject id retrieved',subjectId)
  console.log('service id retrieved',serviceId)
  
  useEffect(() => {
    if (!projectTypeId) {
      setError('Invalid request. No selection history found.');
      setLoading(false);
      return;
    }
    
    const fetchExperts = async () => {
      try {
        const response = await fetch(`${API_URL}/experts/search?service_id=${serviceId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch experts');
        }
        
        const data = await response.json();
        console.log("API Response:", data); // Debugging
        
        if (!data.experts || data.experts.length === 0) {
          throw new Error("No experts available for this category.");
        }
        
        setExperts(data.experts); // ✅ Set the experts array properly
      } catch (error) {
        console.error("Error fetching experts:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperts();
  }, [projectTypeId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={60} color={'#4A90E2'} />
      </div>
    );
  }
  
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  
  return (
    // Use the mobile fixed layout on small screens, original layout on larger screens
    <div className="sm:p-0 sm:bg-slate-200 sm:min-h-screen flex flex-col h-screen sm:block">
      {/* Header Section - Static on all screen sizes */}
      <div className="flex-none sm:flex-auto bg-slate-200 ">
        <div className="relative h-64 sm:h-[400px] mb-4 bg-cover bg-center" style={{ backgroundImage: "url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg)", }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center p-8">
            <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">
              Choose an Expert
            </h1>
            <p className="text-sm sm:text-lg text-white max-w-xl mx-auto mb-6">
              Most of our experts are lecturers and teachers from various institutions, offering their expertise as freelance professionals.
            </p>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-2">Available Experts</h2>
      </div>
      
      {/* Experts Section - Scrollable on mobile, normal on desktop */}
      <div className="flex-grow overflow-y-auto bg-slate-200 sm:overflow-visible sm:flex-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {experts.length > 0 ? (
            experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} onHire={() => navigate('/userprofile/hireexpert', { state: { expertId: expert.id } })} />
            ))
          ) : (
            <p className="text-center">No experts found matching your selection</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertSelectionPage;