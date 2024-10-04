import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

function AddServicePage() {
  const { currentUser, authToken } = useContext(UserContext);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]); // State for subjects

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
    title: Yup.string()
      .required("Service title is required")
      .min(2, "Title must be at least 2 characters long"),
    description: Yup.string()
      .required("Service description is required")
      .min(5, "Description must be at least 5 characters long"),
    price: Yup.number()
      .required("Service price is required")
      .positive("Price must be a positive number")
      .min(0.01, "Price must be at least 0.01"),
    project_type_id: Yup.string().required("Project type is required"),
    subject_id: Yup.string().required("Subject is required"), // Validation for subject
  });

  const handleAddServiceSubmit = async (values, { resetForm }) => {
    if (currentUser.username !== "admin_user") {
      alert("You do not have permission to add services.");
      return;
    }

    const data = {
      title: values.title,
      description: values.description,
      price: values.price,
      project_type_id: values.project_type_id, // Include project_type_id
      subject_id: values.subject_id, // Include subject_id
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/services", {
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
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Please try again.");
    }
  };

  return (
    <div className="w-full relative bg-aliceblue min-h-screen overflow-hidden text-left text-base text-black font-poppins p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl mb-4">Add Service</h2>

      <Formik
        initialValues={{
          title: "",
          description: "",
          price: "",
          project_type_id: "", // Initialize project_type_id
          subject_id: "", // Initialize subject_id
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddServiceSubmit}
      >
        {({ touched, errors }) => (
          <Form className="space-y-6">
            {/* Service Title */}
            <div className="mb-4">
              <label className="block mb-2">Title:</label>
              <Field
                name="title"
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${
                  touched.title && errors.title ? "border-red-500" : ""
                }`}
                type="text"
                placeholder="Service Title"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Service Description */}
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <Field
                name="description"
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${
                  touched.description && errors.description ? "border-red-500" : ""
                }`}
                as="textarea"
                rows="4"
                placeholder="Service Description"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Service Price */}
            <div className="mb-4">
              <label className="block mb-2">Price:</label>
              <Field
                name="price"
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${
                  touched.price && errors.price ? "border-red-500" : ""
                }`}
                type="number"
                placeholder="Service Price"
              />
              <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Project Type Dropdown */}
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

            {/* Subject Dropdown */}
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

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-md"
              >
                Add Service
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddServicePage;
