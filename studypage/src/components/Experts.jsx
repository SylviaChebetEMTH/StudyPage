import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './contexts/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { Field, Formik, Form, ErrorMessage } from "formik";

const ExpertPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate()

  const { currentUser, authToken } = useContext(UserContext);
  const API_URL = 'http://127.0.0.1:5000';

  console.log('currentUser is here at experts', currentUser)

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
      console.log(data); 
      setExperts(Array.isArray(data.experts) ? data.experts : []);
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
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
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
          className="relative h-[400px] mb-4 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg?t=st=1728331518~exp=1728335118~hmac=5428c854e95a9ee0af0928c5b3902e81ab7688795b5dc7ab812a07eb9419fced&w=740)',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative z-10 text-center p-4 md:p-8">
            <div>
              <h1 className="text-2xl md:text-4xl text-white font-bold mb-2 md:mb-4">
                Skilled Professionals at Your Service
              </h1>
              <p className="text-sm md:text-lg text-white max-w-sm md:max-w-xl mx-auto mb-4 md:mb-6">
                Connect with top experts across various fields to elevate your projects. Find the perfect match based on expertise, reviews, and availability.
              </p>
            </div>
            <div className="flex flex-col justify-center items-center z-10">
              <Formik
                initialValues={{ project_type_id: '', subject_id: '', search: '' }}
                onSubmit={(values) => {
                  if (values.search === '') {
                    setSearchTerm(''); 
                  } else {
                    setSearchTerm(values.search); 
                  }
                }}
              >
                {({ touched, errors }) => (
                  <Form className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-lg md:max-w-4xl">
                    <Field
                      type="text"
                      name="search"
                      placeholder="Search by name"
                      className="py-2 px-4 rounded text-xs text-gray-700 bg-[#CBDFDE] w-full"
                    />
                    <Field
                      name="project_type_id"
                      as="select"
                      className={`border py-2 px-4 text-xs text-gray-700 bg-[#CBDFDE] rounded-md w-full sm:w-auto ${touched.project_type_id && errors.project_type_id
                          ? 'border-red-500'
                          : 'border-gray-500'
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
                    <ErrorMessage
                      name="project_type_id"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                    <Field
                      name="subject_id"
                      as="select"
                      className={`border py-2 px-4 text-xs text-gray-700 bg-[#CBDFDE] rounded-md w-full sm:w-auto ${touched.subject_id && errors.subject_id
                          ? 'border-red-500'
                          : 'border-gray-300'
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
                    <ErrorMessage
                      name="subject_id"
                      component="div"
                      className="text-red-500 text-sm"
                    />
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center mb-4">
          Experts List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8">
          {Array.isArray(experts) && experts.length > 0 ? (
            experts.filter(expert => 
              searchTerm === '' || expert.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((expert) => (
              <div
                key={expert.id}
                className="border p-4 flex flex-col justify-between shadow-lg rounded-lg overflow-hidden bg-white transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
              >
                <div className="w-full h-[200px] sm:h-[300px] flex justify-center items-center border border-[#e4e4e4] relative overflow-hidden">
                  <img
                    src={expert.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-center text-center mt-4">
                  <h2 className="text-md font-medium text-gray-700 mb-1">
                    {expert.name}
                  </h2>
                  <p className="text-sm text-gray-700">{expert.title}</p>
                </div>
                <hr className="my-2" />
                {expert.education && (
                  <p className="text-sm text-gray-700">{expert.education}</p>
                )}
                {expert.languages && (
                  <p className="text-sm text-gray-700">
                    {expert.languages.split(',').slice(0, 4).join(', ')}
                  </p>
                )}
                <button
                  onClick={() => hireExpert(expert.id)}
                  className="mt-4 bg-[#85C4C2] text-white px-4 py-2 rounded hover:bg-[#6EA5A4]"
                >
                  Hire Expert
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-700">
              No experts available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertPage;
