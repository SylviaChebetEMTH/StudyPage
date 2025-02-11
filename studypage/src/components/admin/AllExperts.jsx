import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Circles } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import ExpertComments from './ExpertComments'
export default function AllExperts() {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpert, setEditingExpert] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [notification, setNotification] = useState(null);
  const expertsPerPage = 6;
  const { currentUser, authToken } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const fetchData = () => {
    fetch("https://studypage.onrender.com/experts")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.experts)) {
          setExperts(data.experts);
        } else {
          console.error("Expected 'experts' to be an array:", data);
          setExperts([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching experts:", error);
        setIsLoading(false); 
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const response = await fetch("https://studypage.onrender.com/project-types", {
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
        setProjectTypes(data); // Set the fetched project types to the state
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("https://studypage.onrender.com/subjects", {
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
    fetchData();
    fetchProjectTypes();
    fetchSubjects();
  }, [authToken]);
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleEditExpert = async (expertId) => {
    if (!currentUser.is_admin) {
      toast.error("You do not have permission to edit expert.");
      return;
    }
    setIsLoading(true);

    const token = authToken || localStorage.getItem("access_token");
    let profilePictureUrl = updatedValues.profile_picture;

    // If a new profile picture URL is provided, upload it to Cloudinary
    if (updatedValues.profilePicture instanceof File) {
      console.log("Selected File:", updatedValues.profile_picture);
      const formData = new FormData();
      formData.append("file", updatedValues.profilePicture);
      formData.append("upload_preset", "dlp71jbrz");

      // Upload to Cloudinary
      try {
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dlp71jbrz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadResponse.json();
        console.log("Upload Response:", uploadData);
        if (uploadResponse.ok) {
          profilePictureUrl = uploadData.secure_url;
          console.log("Uploaded image URL:", profilePictureUrl);
        } else {
          throw new Error(uploadData.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        setIsLoading(false);
        return;
      }
    }

    fetch(`https://studypage.onrender.com/experts/${expertId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...updatedValues, profilePicture: profilePictureUrl, project_type: updatedValues.projectType, subject: updatedValues.subject, }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(`Error: ${err.message}`);
          });
        }
        return response.json();
      })
      .then((updatedExpert) => {
        console.log("Updated Expert:", updatedExpert);
        if (!updatedExpert) {
          throw new Error("Updated expert is undefined");
        }
        setExperts((prevExperts) =>
          prevExperts.map((expert) =>
            expert.id === expertId ? updatedExpert : expert
          )
        );
        fetchData();
        toast.success("Expert updated successfully!", {
          position:'top-right',
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
          draggable: true,
          theme: "light"
        });
        
        setEditingExpert(null);
        setUpdatedValues({});
      })
      .catch((error) => {
        toast.error(`Error updating expert`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, 
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateChange = (e, field) => {
    if (field === "profilePicture") {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        // Show preview of the image
        setPreviewUrl(URL.createObjectURL(file));
        // Update the profile picture in state
        setUpdatedValues((prevValues) => ({
          ...prevValues,
          [field]: file,
        }));
      }
    } else {
      setUpdatedValues((prevValues) => ({
        ...prevValues,
        [field]: e.target.value,
      }));
    }
  };

  const handleDeleteExpert = (expertId) => {
    if (!currentUser.is_admin) {
      toast.error("You do not have permission to add services.");
      return;
    }
    setIsLoading(true);

    const token = authToken || localStorage.getItem("access_token");
    fetch(`https://studypage.onrender.com/experts/${expertId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          setExperts((prevExperts) =>
            prevExperts.filter((expert) => expert.id !== expertId)
          );
          toast.success("Expert deleted successfully!", {
            position: "top-right",
            autoClose: 3000,
            closeButton: true,
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        } else {
          console.error("Error deleting expert:", response);
          toast.error("Error deleting expert. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            closeButton: true,
            closeOnClick: true,
            draggable: true,
            theme: "light",
          });
        }
      })

  };

  const cancelEdit = () => {
    fetchData();
    setEditingExpert(null);
    setUpdatedValues({});
    setIsLoading(false);
  };

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredExperts = (experts || []).filter((expert) =>
    expert.title ? expert.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = filteredExperts.slice(
    indexOfFirstExpert,
    indexOfLastExpert
  );
  console.log(experts)

  return (
    <div className="relative">
      <div className="bg-white p-4 min-h-screen">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:flex-1 space-y-4 md:space-y-0 md:space-x-4">
            <h1 className="text-xl font-bold md:flex-1">All Experts</h1>
            <div className="relative flex-shrink-0 w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search experts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded-md w-full"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded-md md:w-1/3"
            >
              <option value="newest">Sort by Newest</option>
              <option value="description">Sort by Description</option>
            </select>
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {currentExperts.length === 0 ? (
            <div className="col-span-3 p-4 text-center">No experts available.</div>
          ) : (
            currentExperts.map((expert) => (
              <div
                key={expert.id}
                className="border p-4 flex flex-col justify-between shadow-xl rounded-lg overflow-hidden bg-white aos-init"
              >
                <div className="flex-grow">

                  <div className="flex-grow rounded-full h-[150px] mb-4 relative overflow-hidden group transition">
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-full h-full mx-auto flex justify-center items-center">
                        <img
                          src={expert.profilePicture}
                          alt={`${expert.name}'s profile`}
                          className="w-32 h-32 object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-lg mb-1 text-center">{expert.name}</h2>
                  <h3 className="text-sm mb-2 text-gray-600 text-center">{expert.title}</h3>
                  <hr className="mt-2 border-gray-300" />
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Expertise:</span> {expert.expertise}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Description:</span> {expert.description}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Biography:</span> {expert.biography}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Education:</span> {expert.education}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Languages:</span> {expert.languages}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Project Type:</span> {expert.projectType}
                  </p>
                  <p className="mb-2 text-sm">
                    <span className="font-medium">Subjects:</span> {expert.subject}
                  </p>
                  {/* <p className="mb-2 text-sm">
                    <span className="font-medium">Comments:</span> {expert.comments}
                  </p> */}
                </div>
                {currentUser.is_admin && (
                  <div className="mt-4">
                    {/* Comments section first */}
                    <ExpertComments
                      expert={expert}
                      comments={Array.isArray(expert.comments) ? expert.comments : []}
                      authToken={authToken}
                      onCommentUpdate={(updatedComment) => {
                        setExperts((prevExperts) =>
                          prevExperts.map((exp) =>
                            exp.id === expert.id
                              ? {
                                  ...exp,
                                  comments: exp.comments.map((c) =>
                                    c.id === updatedComment.id ? updatedComment : c
                                  ),
                                }
                              : exp
                          )
                        );
                      }}
                      onCommentDelete={(commentId) => {
                        setExperts((prevExperts) =>
                          prevExperts.map((exp) =>
                            exp.id === expert.id
                              ? {
                                  ...exp,
                                  comments: exp.comments.filter((c) => c.id !== commentId),
                                }
                              : exp
                          )
                        );
                      }}
                    />
                    
                    {/* Action buttons in their own div */}
                    <div className="flex flex-row justify-between mt-4">
                      <button
                        onClick={() => {
                          setEditingExpert(expert.id);
                          setUpdatedValues({
                            name: expert.name,
                            description: expert.description,
                            biography: expert.biography,
                            education: expert.education,
                            languages: expert.languages,
                            project_type: expert.projectType,
                            subjects: expert.subject,
                            profile_picture: expert.profilePicture,
                          });
                        }}
                        className="p-2 bg-[#85C4C2] text-white rounded-md"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDeleteExpert(expert.id)}
                        className="p-2 bg-[#769594] text-white rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#6E8F9F] bg-opacity-75"
            style={{ zIndex: 9999 }}>

            <Circles
              height="80"
              width="80"
              color="#296A8B"
              ariaLabel="loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        {/* Editing Section */}
        {editingExpert && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Edit Expert</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditExpert(editingExpert);
                }}
              >
                <div className="flex flex-col mb-4">
                  <label className="mb-2">Name:</label>
                  <input
                    type="text"
                    value={updatedValues.name}
                    onChange={(e) => handleUpdateChange(e, 'name')}
                    className="p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label className="mb-2">Profile Picture:</label>
                  <input
                    type="file"
                    onChange={(e) => handleUpdateChange(e, 'profilePicture')}
                    className="border py-2 px-4 border-gray-300 rounded-md w-full"
                  />
                </div>
                {previewUrl && <img src={previewUrl} alt="Profile Preview" className="rounded-full h-20 w-20" />}
                <div className="flex flex-col mb-4">
                  <label className="mb-2">Description:</label>
                  <input
                    type="text"
                    value={updatedValues.description}
                    onChange={(e) => handleUpdateChange(e, 'description')}
                    className="p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label className="mb-2">Biography:</label>
                  <textarea
                    value={updatedValues.biography}
                    onChange={(e) => handleUpdateChange(e, 'biography')}
                    className="p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label className="mb-2">Education:</label>
                  <input
                    type="text"
                    value={updatedValues.education}
                    onChange={(e) => handleUpdateChange(e, 'education')}
                    className="p-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label className="mb-2">Languages:</label>
                  <input
                    type="text"
                    value={updatedValues.languages}
                    onChange={(e) => handleUpdateChange(e, 'languages')}
                    className="p-2 border rounded-md"
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2">Project Types:</label>
                  <select
                    name="project_types"
                    value={updatedValues.project_type}
                    onChange={(e) => handleUpdateChange(e, 'projectType')}
                    required
                    className="p-2 border rounded-md w-full"
                  >
                    <option value="">Select Project Type</option>
                    {projectTypes.length > 0 ? (
                      projectTypes.map((projectType) => (
                        <option key={projectType.id} value={projectType.name}>
                          {projectType.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading project types...</option>
                    )}
                  </select>
                </div>
                <div className="flex flex-col mb-4">
                  <label className="mb-2">Subjects:</label>
                  <select
                    name="subjects"
                    value={updatedValues.subjects}
                    onChange={(e) => handleUpdateChange(e, 'subject')}
                    required
                    className="p-2 border rounded-md w-full"
                  >
                    <option value="">Select Subject Area</option>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading subject areas...</option>
                    )}
                  </select>
                </div>


                <div className="flex justify-between mt-4">
                  {!isLoading && (
                    <>
                      <button type="submit" className="p-2 bg-[#769594] text-white rounded-md" >Save Changes</button>
                      <button type="button" onClick={cancelEdit} className="p-2 bg-gray-400 text-white rounded-md">Cancel</button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>

        )}

        {notification && <div className="bg-[#85C4C2] p-4 mt-4">{notification}</div>}
      </div>
    </div>
  );
}


