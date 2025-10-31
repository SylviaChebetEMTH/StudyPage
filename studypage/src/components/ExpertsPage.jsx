import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import ExpertCard from './ExpertCard';

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExperts, setFilteredExperts] = useState([]);
  const navigate = useNavigate();
  const API_URL = 'https://studypage-76hu.onrender.com';

  useEffect(() => {
    const fetchAllExperts = async () => {
      // ✅ Retrieve and parse localStorage data correctly
      const all_experts = localStorage.getItem("experts");
      
      if (all_experts) {
        try {
          const parsedExperts = JSON.parse(all_experts);
          console.log('expa',parsedExperts)
          setExperts(parsedExperts);
          setFilteredExperts(parsedExperts);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          localStorage.removeItem("experts"); // Remove corrupted data
        }
      }
  
      setError(null);
      try {
        const response = await fetch(`${API_URL}/experts`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch experts");
        }
  
        const data = await response.json();
        console.log("API Response:", data);
  
        if (!data.experts || data.experts.length === 0) {
          setExperts([]);
          setFilteredExperts([]);
          return;
        }
  
        setExperts(data.experts);
        setFilteredExperts(data.experts);
  
        // ✅ Store correctly as JSON string
        localStorage.setItem("experts", JSON.stringify(data.experts));
      } catch (error) {
        console.error("Error fetching experts:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllExperts();
  }, []); // ✅ Empty dependency array to prevent infinite loop

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExperts(experts);
    } else {
      const filtered = experts.filter(expert => 
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expert.subject && expert.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredExperts(filtered);
    }
  }, [searchTerm, experts]);

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
    <div className="sm:p-0 sm:bg-slate-200 sm:min-h-screen flex flex-col h-screen sm:block">
      {/* Header Section - Static on all screen sizes */}
      <div className="flex-none sm:flex-auto bg-slate-200">
        <div className="relative h-64 sm:h-[400px] mb-4 bg-cover bg-center" 
          style={{ backgroundImage: "url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg)" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center p-8">
            <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">
              Our Expert Network
            </h1>
            <p className="text-sm sm:text-lg text-white max-w-xl mx-auto mb-6">
              Connect with top-rated experts from various institutions offering their expertise as freelance professionals.
            </p>
            
            {/* Search Box */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search by name or subject..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-2">
          {filteredExperts.length} Expert{filteredExperts.length !== 1 ? 's' : ''} Available
        </h2>
      </div>
      
      {/* Experts Section - Scrollable on mobile, normal on desktop */}
      <div className="flex-grow overflow-y-auto bg-slate-200 sm:overflow-visible sm:flex-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <ExpertCard 
                key={expert.id} 
                expert={expert} 
                onHire={() => navigate('/userprofile/hireexpert', { state: { expertId: expert.id } })} 
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600 py-8">
              No experts found matching your search. Try different keywords or clear your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertsPage;