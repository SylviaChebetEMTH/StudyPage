import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCode, faFlask, faCalculator } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate()

  const API_URL = 'https://studypage.onrender.com';

  const move = (projectTypeId)=> {
    localStorage.setItem("selectedProjectType", projectTypeId);
    // localStorage.setItem("selectedSubject", subjectId);
    navigate('/expertspage')
  }

  // Icons for different subjects
  const subjectIcons = {
    "English": faBook,
    "Web Development": faCode,
    "Science": faFlask,
    "Mathematics": faCalculator
  };

  // Skeleton loader for a better loading experience
  const SkeletonCard = () => (
    <div className="bg-white shadow-lg rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
    </div>
  );

  // Function to fetch services from the backend
  const fetchServices = async () => {
    // const storedServices = localStorage.getItem('service');
    // if (storedServices) {
    //   setServices(JSON.parse(storedServices));
    //   setLoading(false);
    //   return;
    // }
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('services retrieved',data.services)
      const servicesArray = Array.isArray(data.services) ? data.services : []; 
      setServices(servicesArray);
      localStorage.setItem('services', JSON.stringify(servicesArray));
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Load more services when user clicks "Load More"
  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Filter services based on search query and selected project type
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedProjectType ? service.project_type_id === Number(selectedProjectType) : true)
  );

  // Show skeleton loaders while loading
  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4 md:px-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Loading available services...
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }  

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 py-16 px-4 md:px-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explore our wide range of services designed to help you achieve success.
        </p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-screen-xl mx-auto">
        <input
          type="text"
          placeholder="Search services..."
          className="p-2 border rounded w-full md:w-1/3 mb-4 md:mb-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full md:w-1/3"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
        >
          <option value="" className='text-blue-700'>All Project Types</option>
          {[
            ...new Map(
              services.map(s => [s.project_type_id, { id: s.project_type_id, title: s.unit }])
            ).values()
          ].map(type => (
            <option key={type.id} value={type.id}>{type.title}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {filteredServices.slice(0, visibleCount).map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-lg rounded-xl p-6 transform transition-transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={subjectIcons[service.subject] || faBook} className="text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold">{service.title}</h2>
            </div>
            
            <p className="text-gray-700 mb-2">{service.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                ${service.price_per_page} per page
              </span>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => move(service.id)} >
                Request Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredServices.length && (
        <div className="text-center mt-6">
          <button
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}

      {/* No Services Message */}
      {filteredServices.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No services available</p>
      )}
    </div>
  );
};

export default Services;
