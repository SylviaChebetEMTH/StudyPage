import React, { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Formik, Field, Form } from "formik";

function AddServicePage() {
  const { currentUser, authToken } = useContext(UserContext);

  const handleAddServiceSubmit = async (values) => {
    if (currentUser.username !== "admin_user") {
      alert("You do not have permission to add services.");
      return;
    }

    const data = {
      title: values.title,
      description: values.description,
      price: values.price,
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

      // Reset form after successful submission
      values.title = "";
      values.description = "";
      values.price = "";
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
        }}
        onSubmit={handleAddServiceSubmit}
      >
        {({ values }) => (
          <Form className="space-y-6">
            {/* Service Title */}
            <div className="mb-4">
              <label className="block mb-2">Title:</label>
              <Field
                name="title"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="text"
                placeholder="Service Title"
              />
            </div>

            {/* Service Description */}
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <Field
                name="description"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                as="textarea"
                rows="4"
                placeholder="Service Description"
              />
            </div>

            {/* Service Price */}
            <div className="mb-4">
              <label className="block mb-2">Price:</label>
              <Field
                name="price"
                className="border py-2 px-4 border-gray-300 rounded-md w-full"
                type="number"
                placeholder="Service Price"
              />
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
