import React, { useEffect, useState } from 'react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://127.0.0.1:5000';

  // Function to fetch services from backend
  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setServices(Array.isArray(data.services) ? data.services : []); 
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-50 py-16 px-4 md:px-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explore our wide range of services designed to help you achieve success.
        </p>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-lg rounded-xl p-6 transform transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h2>
              <p className="text-gray-600 mb-2">Description: {service.description}</p>
              <p className="text-gray-600 mb-2">Price: ${service.price} {service.unit}</p>
              <p className="text-gray-600 mb-2">Project Type: {service.project_type_name} </p>
              <p className="text-gray-600">Subject Area: {service.subject_name}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No services available</p>
        )}
      </div>
    </div>
  );
};

export default Services;
