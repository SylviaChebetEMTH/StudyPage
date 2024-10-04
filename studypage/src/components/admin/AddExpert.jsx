import React, { useState, useContext,useEffect } from "react";
import { UserContext } from "../contexts/userContext";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const CLOUDINARY_UPLOAD_PRESET = "dlp71jbrz"; // Replace with your actual Cloudinary upload preset name
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dlp71jbrz/image/upload`; // Replace with your Cloudinary cloud name

function AddExpertPage() {
  const { currentUser, authToken } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]); 

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/project-types", {
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
        const response = await fetch("http://127.0.0.1:5000/subjects", { // Adjust endpoint as needed
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
        setSubjects(data); // Set the fetched subjects to the state
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchProjectTypes();
    fetchSubjects(); // Fetch subjects when the component mounts
  }, [authToken]);

  const validationSchema = Yup.object().shape({
    project_type_id: Yup.string().required("Project type is required"),
    subject_id: Yup.string().required("Subject is required"), // Validation for subject
  });

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed.");
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setProfilePicture(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error.message);
      }
    }
  };

 

  const handleAddExpertSubmit = async (values) => {
    if (currentUser.username !== "admin_user") {
      alert("You do not have permission to add experts.");
      return;
    }
  
    // Ensure profile picture is not null
    if (!profilePicture) {
      alert("Please upload a profile picture.");
      return;
    }
  
    const data = {
      name: values.name,
      title: values.title,
      expertise: values.expertise,
      description: values.description,
      biography: values.biography,
      education: values.education,
      languages: values.languages,
      project_type_id: values.project_type_id, // Include project_type_id
      subject_id: values.subject_id, // Include subject_id
      profile_picture: profilePicture,  
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/experts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Unknown error");
      }
  
      const result = await response.json();
      alert(result.message);
  
      // Reset the form after successful submission
      values.name = "";
      values.title = "";
      values.expertise = "";
      values.description = "";
      values.biography = "";
      values.education = "";
      values.languages = "";
      values.project_type_id = "";
      values.subject_id = "";
      setProfilePicture(null);
    } catch (error) {
      console.error("Error adding expert:", error);
      alert("Failed to add expert. Please try again.");
    }
  };
  

  return (
    <div className="w-full relative bg-aliceblue min-h-screen overflow-hidden text-left text-base text-black font-poppins p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl mb-4">Expert Information</h2>

      <Formik
        initialValues={{
          name: "",
          title: "",
          expertise: "",
          description: "",
          biography: "",
          education: "",
          languages: "",
          project_type_id: "",
          subject_id: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddExpertSubmit}
      >
        {({ touched, errors }) => (
          <Form className="space-y-6">
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <Field
                name="name"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Expert's Name"
              />
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block mb-2">Title:</label>
              <Field
                name="title"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Expert's Title"
              />
            </div>

            {/* Expertise */}
            <div className="mb-4">
              <label className="block mb-2">Expertise:</label>
              <Field
                name="expertise"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Area of Expertise"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <Field
                name="description"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Description"
              />
            </div>

            {/* Biography */}
            <div className="mb-4">
              <label className="block mb-2">Biography:</label>
              <Field
                name="biography"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                as="textarea"
                rows="4"
                placeholder="Biography"
              />
            </div>

            {/* Education */}
            <div className="mb-4">
              <label className="block mb-2">Education:</label>
              <Field
                name="education"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Education Background"
              />
            </div>

            {/* Languages */}
            <div className="mb-4">
              <label className="block mb-2">Languages:</label>
              <Field
                name="languages"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Languages"
              />
            </div>

            {/* Project Types */}
          
            <div className="mb-4">
              <label className="block mb-2">Project Type:</label>
              <Field
                name="project_type_id"
                as="select"
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${
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
            </div>

            {/* Subjects */}
           
            <div className="mb-4">
              <label className="block mb-2">Subject:</label>
              <Field
                name="subject_id"
                as="select"
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${
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
            </div>

            {/* Profile Picture Upload */}
            <div className="mb-4">
              <label className="block mb-2">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                onChange={handleProfilePictureChange}
              />
              {profilePicture && (
                <div className="mt-2">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-md"
              >
                Add Expert
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddExpertPage;
