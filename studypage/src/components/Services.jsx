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
      console.log(data); // Log to verify structure
      setServices(Array.isArray(data.services) ? data.services : []); // Access 'services' from the response
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Services List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(services) && services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-300 shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-gray-700">Description: {service.description}</p>
              <p className="text-gray-700">Price: ${service.price_per_page}</p>
              <p className="text-gray-700">Duration: {service.duration} hours</p>
              {/* You can add more fields as needed */}
            </div>
          ))
        ) : (
          <p>No services available</p>
        )}
      </div>
    </div>
  );
};

export default Services;
