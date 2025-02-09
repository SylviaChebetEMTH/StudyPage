import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './contexts/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { Field, Formik, Form, ErrorMessage } from "formik";
import ExpertCard from './ExpertCard';

const ExpertPage = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate()

  const { currentUser, authToken } = useContext(UserContext);
  const API_URL = 'https://studypage.onrender.com';

  // Function to fetch experts from backend
  const fetchExperts = async () => {
    try {
      const response = await fetch(`${API_URL}/experts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const expertsArray = Array.isArray(data.experts) ? data.experts : [];
      setExperts(expertsArray);
      console.log('arrayofexpertssghh',expertsArray);
      setFilteredExperts(expertsArray); // Initialize filtered experts with all experts
    } catch (error) {
      console.error('Error fetching experts:', error);
      setError('Failed to fetch experts.');
    } finally {
      setLoading(false);
    }
  };

  // Handle hiring an expert
  const hireExpert = (expertId) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
    } else {
      navigate(`/userprofile/hireexpert`, { state: { expertId } });
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // Function to filter experts based on search criteria
  const filterExperts = (searchCriteria) => {
    let filtered = [...experts];

    // Filter by name if search text is provided
    if (searchCriteria.search) {
      const searchLower = searchCriteria.search.toLowerCase();
      filtered = filtered.filter(expert => 
        expert.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by project type if selected
    if (searchCriteria.project_type_id) {
      filtered = filtered.filter(expert => 
        expert.projectTypes?.includes(parseInt(searchCriteria.project_type_id))
      );
    }

    // Filter by subject if selected
    if (searchCriteria.subject_id) {
      filtered = filtered.filter(expert => 
        expert.subjects?.includes(parseInt(searchCriteria.subject_id))
      );
    }

    setFilteredExperts(filtered);
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/project-types`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProjectTypes(data);
        setProjectTypes(data);
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_URL}/subjects`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSubjects(data);
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchProjectTypes();
    fetchSubjects();
  }, [authToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-0">
      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 max-w-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Login Required</h2>
            <p className="mb-4 text-center">You need to log in to hire an expert.</p>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Link
                to="/login"
                className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-400 text-center"
              >
                Log In
              </Link>
              <button
                onClick={closeLoginPrompt}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-200 min-h-screen">
        <div
          className="relative h-64 sm:h-[400px] mb-4 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg?t=st=1728331518~exp=1728335118~hmac=5428c854e95a9ee0af0928c5b3902e81ab7688795b5dc7ab812a07eb9419fced&w=740)",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center p-8">
            <div>
              <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">
                Skilled Professionals at Your Service
              </h1>
              <p className="text-sm sm:text-lg text-white max-w-xl mx-auto mb-6">
                Connect with top experts across various fields to elevate your projects. Find the perfect
                match based on expertise, reviews, and availability.
              </p>
            </div>
            <div className="flex flex-col justify-center items-center z-10">
              <Formik
                initialValues={{ search: "", project_type_id: "", subject_id: "" }}
                onSubmit={(values) => {
                  filterExperts(values);
                }}
              >
                {({ touched, errors }) => (
                  <Form className="flex flex-wrap justify-between gap-4 mb-6 w-full max-w-xs sm:max-w-4xl">
                    <Field
                      type="text"
                      name="search"
                      placeholder="Search by name"
                      className="py-2 px-4 rounded text-xs text-gray-700 bg-[#CBDFDE] w-full sm:w-1/4"
                    />
                    <Field
                      name="project_type_id"
                      as="select"
                      className={`border py-2 px-4 border-gray-500 text-xs text-gray-700 bg-[#CBDFDE] rounded-md w-full sm:w-1/4 ${
                        touched.project_type_id && errors.project_type_id ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.length > 0 ? (
                        projectTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No project types available</option>
                      )}
                    </Field>
                    <ErrorMessage name="project_type_id" component="div" className="text-red-500 text-sm" />

                    <Field
                      name="subject_id"
                      as="select"
                      className={`border py-2 px-4 border-gray-300 text-xs text-gray-700 bg-[#CBDFDE] rounded-md w-full sm:w-1/4 ${
                        touched.subject_id && errors.subject_id ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select a subject</option>
                      {subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No subjects available</option>
                      )}
                    </Field>
                    <ErrorMessage name="subject_id" component="div" className="text-red-500 text-sm" />

                    <button
                      type="submit"
                      className="p-2 rounded text-gray-700 bg-[#7E9292] font-semibold w-full sm:w-auto"
                    >
                      Search
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center mb-2">Experts List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} onHire={hireExpert} currentUser={currentUser} />
            ))
          ) : (
            <p className="text-center">No experts found matching your criteria</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertPage;