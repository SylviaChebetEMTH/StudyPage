import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AddServicePage() {
  const { currentUser, authToken } = useContext(UserContext);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const response = await fetch("https://studypage-76hu.onrender.com/project-types", {
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
        const response = await fetch("https://studypage-76hu.onrender.com/subjects", {
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
    if (!currentUser.is_admin) {
      toast.error("You do not have permission to add services.");
      return;
    }
    setLoading(true);

    const data = {
      title: values.title,
      description: values.description,
      price: values.price,
      project_type_id: values.project_type_id,
      subject_id: values.subject_id,
    };

    try {
      const response = await fetch("https://studypage-76hu.onrender.com/services", {
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
      // alert(result.message);
      toast.success(result.message, {
        position: "top-right",
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        draggable: true,
        theme: "light",
      });
      navigate("/admin/allservices")
      resetForm();
      setLoading(false)
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service. Please try again.",{
        position: "top-right",
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
        draggable: true,
        theme: "light",
      })
    }
  };

  return (
    <div className="w-full relative bg-aliceblue min-h-screen overflow-hidden text-left text-base text-black font-poppins p-4 sm:p-6 md:p-8">
      {loading && (
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
      <h2 className="text-xl sm:text-2xl mb-4">Add Service</h2>
      <Formik
        initialValues={{
          title: "",
          description: "",
          price: "",
          project_type_id: "",
          subject_id: "",
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
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${touched.title && errors.title ? "border-red-500" : ""
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
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${touched.description && errors.description ? "border-red-500" : ""
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
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${touched.price && errors.price ? "border-red-500" : ""
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
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${touched.project_type_id && errors.project_type_id ? "border-red-500" : ""
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
                className={`border py-2 px-4 border-gray-300 rounded-md w-full ${touched.subject_id && errors.subject_id ? "border-red-500" : ""
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
                className="bg-[#769594] text-white py-2 px-6 rounded-md"
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
