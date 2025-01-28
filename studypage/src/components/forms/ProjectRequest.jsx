// import React, { useState, useEffect, useContext } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { UserContext } from '../contexts/userContext';

// const ProjectRequest = () => {
//   const { authToken } = useContext(UserContext);
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [projectTitle, setProjectTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [projectTypes, setProjectTypes] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedProjectType, setSelectedProjectType] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [deadline, setDeadline] = useState('');
//   const [notification, setNotification] = useState(null);
//   const [expertId, setExpertId] = useState(state ? state.expertId : '');
//   const [numberOfPages, setNumberOfPages] = useState('');

//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/project-types')
//       .then((response) => response.json())
//       .then((data) => setProjectTypes(data))
//       .catch((error) => console.error('Error fetching project types:', error));
//   }, []);

//   // Fetch subjects from API
//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/subjects')
//       .then((response) => response.json())
//       .then((data) => setSubjects(data))
//       .catch((error) => console.error('Error fetching subjects:', error));
//   }, []);

//   const handleFileChange = (e) => {
//     setAttachments(e.target.files);
//   };

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => {
//         setNotification(null);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Log all form data to verify the state
//     console.log('Project detailsssw',{
//       projectTitle,
//       description,
//       selectedProjectType,
//       selectedSubject,
//       deadline,
//       expertId,
//       numberOfPages,
//       attachments,
//     });

//     // Validate required fields
//     if (!projectTitle || !description || !selectedProjectType || !selectedSubject || !deadline || !expertId || !numberOfPages){
//       alert("Please fill in all the required fields.");
//       return;
//     }

//     if (attachments.length === 0) {
//       alert("Please attach at least one file.");
//       return;
//     }

//     // Create form data to handle file attachments
//     const formData = new FormData();
//     formData.append('project_title', projectTitle);
//     formData.append('project_description', description);
//     formData.append('project_type', selectedProjectType);
//     formData.append('subject', selectedSubject);
//     formData.append('deadline', deadline);
//     formData.append('expert_id', expertId);
//     formData.append('number_of_pages', numberOfPages);

//     // Attach all selected files
//     for (let i = 0; i < attachments.length; i++) {
//       formData.append('attachments', attachments[i]);
//     }

//     // Log the form data for debugging
//     console.log('Form Data:', formData);

//     // Retrieve the JWT token from context
//     if (!authToken) {
//       console.error("No token found in context.");
//       alert("You must be logged in to submit a project request.");
//       return;
//     }

//     // Submit the form data to the server
//     fetch('http://127.0.0.1:5000/request_expert', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${authToken}`,
//       },
//       body: formData,
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to submit the project request.");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Project request submitted:', data);
//         if (data.msg) {
//           alert(data.msg); 
//         } else {
//           setNotification(`Expert updated successfully.`);
//           alert("Project request submitted successfully.");

//           // Clear form fields
//           setProjectTitle('');
//           setDescription('');
//           setSelectedProjectType('');
//           setSelectedSubject('');
//           setAttachments([]);
//           setDeadline('');
//           setNumberOfPages('');

//           navigate('/projectsummary', { 
//             state: {
//               projectTitle,
//               selectedProjectType,
//               selectedSubject,
//               numberOfPages
//             }
//           });
          
//         }
//       })
//       .catch((error) => {
//         console.error('Error submitting project request:', error);
//         alert("There was an error submitting the project request. Please try again.");
//       });
//   };

//   return (
//     <div className="container mx-auto p-8 bg-gray-300 shadow-md rounded-lg max-w-4xl m-6">
//       <h2 className="text-2xl font-bold mb-4">Request Expert</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="projectTitle" className="block text-sm font-medium">Project Title</label>
//           <input
//             type="text"
//             id="projectTitle"
//             value={projectTitle}
//             onChange={(e) => setProjectTitle(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           ></textarea>
//         </div>

//         <div>
//           <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
//           <select
//             id="projectType"
//             value={selectedProjectType}
//             onChange={(e) => setSelectedProjectType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
//             required
//           >
//             <option value="">Select Project Type</option>
//             {projectTypes.map((type) => (
//               <option key={type.id} value={type.id}>{type.name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
//           <select
//             id="subject"
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
//             required
//           >
//             <option value="">Select Subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.id} value={subject.id}>{subject.name}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="numberOfPages" className="block text-sm font-medium">Number of Pages</label>
//           <input
//             type="number"
//             id="numberOfPages"
//             value={numberOfPages}
//             onChange={(e) => setNumberOfPages(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="attachments" className="block text-sm font-medium">Attachments</label>
//           <input
//             type="file"
//             id="attachments"
//             multiple
//             onChange={handleFileChange}
//             className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700"
//           />
//         </div>

//         <div>
//           <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
//           <input
//             type="date"
//             id="deadline"
//             value={deadline}
//             onChange={(e) => setDeadline(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded text-xs text-gray-700 font-extralight"
//             required
//           />
//         </div>
//         <div className="flex justify-between items-center text-center">
//         <button type="submit" className="mt-4 bg-[#769594] text-white p-2 rounded hover:bg-[#5f7a73] transition duration-200 ease-in-out">
//           Submit Request
//         </button>
//         <Link to="/userprofile/projectsummary" className="mt-4 bg-[#769594] text-white p-2 rounded hover:bg-[#5f7a73] transition duration-200 ease-in-out">
//           Go to Project Summary
//         </Link>

//         </div>
        
//       </form>
//     </div>
//   );
// };

// export default ProjectRequest;

// Above is the clean one


import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { PaystackButton } from 'react-paystack';

const ProjectRequest = () => {
  const { currentUser,authToken } = useContext(UserContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [expertId, setExpertId] = useState(state ? state.expertId : '');
  const [numberOfPages, setNumberOfPages] = useState('');

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');

  // const publicKey = 'pk_live_9d093b52e09ff0b847d1e490f6ad1f1add87c150';
  const publicKey = 'pk_test_00e40d5cd3e321a68b22aad7e1c42a62f8587d4c';
  const email = currentUser?.email || ''; 
  const [paymentRef] = useState(`ref_${Math.floor(Math.random() * 1000000000)}`);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };
  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  // Fetch Project Types
  useEffect(() => {
    fetch('http://127.0.0.1:5000/project-types')
      .then((response) => response.json())
      .then((data) => setProjectTypes(data))
      .catch(() => showError('Error fetching project types.'));
  }, []);

  // Fetch Subjects
  useEffect(() => {
    fetch('http://127.0.0.1:5000/subjects')
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch(() => showError('Error fetching subjects.'));
  }, []);

  // Fetch Services
  useEffect(() => {
    if (selectedProjectType && selectedSubject) {
      fetch(`http://127.0.0.1:5000/services?project_type=${selectedProjectType}&subject=${selectedSubject}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.services || data.services.length === 0) {
            showError('No services found for the selected criteria.');
            setServices([]);
          } else {
            setServices(data.services);
            setSelectedService(data.services[0]);
          }
        })
        .catch(() => showError('Error fetching services.'));
    } else {
      setServices([]);
      setSelectedService(null);
    }
  }, [selectedProjectType, selectedSubject]);

  // Recalculate Total Price
  useEffect(() => {
    if (selectedService && numberOfPages) {
      const calculatedPrice = selectedService.base_price + selectedService.price_per_page * parseFloat(numberOfPages);
      setTotalPrice(calculatedPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedService, numberOfPages]);

  const isFormValid = useMemo(() => {
    if (
      !projectTitle ||
      !description ||
      !selectedProjectType ||
      !selectedSubject ||
      !deadline ||
      !expertId ||
      !numberOfPages
    ) {
      return false;
    }
    if (attachments.length === 0) {
      return false;
    }
    return true;
  }, [
    projectTitle,
    description,
    selectedProjectType,
    selectedSubject,
    deadline,
    expertId,
    numberOfPages,
    attachments,
  ]);

  const handleSuccess = useCallback(async (response) => {
    const reference = response.reference; // Extract the Paystack reference
  
    try {
      // Step 1: Verify Payment with the Backend
      const verifyResponse = await fetch("http://127.0.0.1:5000/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference, // Payment reference from Paystack
          projectDetails: {
            projectTitle,
            description,
            selectedProjectType,
            selectedSubject,
            deadline,
            expertId,
            numberOfPages,
            selectedServiceId: selectedService?.id,
            totalPrice,
          },
        }),
      });
  
      const verifyData = await verifyResponse.json();
  
      if (!verifyData.success) {
        throw new Error(verifyData.message || "Payment verification failed.");
      }
  
      // Step 2: Submit Project After Payment Verification
      const formData = new FormData();
      formData.append("project_title", projectTitle);
      formData.append("project_description", description);
      formData.append("project_type", selectedProjectType);
      formData.append("subject", selectedSubject);
      formData.append("deadline", deadline);
      formData.append("expert_id", expertId);
      formData.append("number_of_pages", numberOfPages);
      formData.append("service_id", selectedService?.id);
      formData.append("total_price", totalPrice);
  
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
  
      const projectResponse = await fetch("http://127.0.0.1:5000/request_expert", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
  
      if (!projectResponse.ok) {
        throw new Error("Failed to submit the project request.");
      }
  
      // Redirect to success page
      navigate("/chat", { state: { totalPrice, reference } });
    } catch (error) {
      console.error("Error:", error);
      showError(error.message || "An unexpected error occurred.");
    }
  }, [
    projectTitle,
    description,
    selectedProjectType,
    selectedSubject,
    deadline,
    expertId,
    numberOfPages,
    selectedService,
    totalPrice,
    attachments,
    authToken,
    navigate,
  ]);
  
  // const handleSuccess = useCallback(() => {
  //   const formData = new FormData();
  //   formData.append('project_title', projectTitle);
  //   formData.append('project_description', description);
  //   formData.append('project_type', selectedProjectType);
  //   formData.append('subject', selectedSubject);
  //   formData.append('deadline', deadline);
  //   formData.append('expert_id', expertId);
  //   formData.append('number_of_pages', numberOfPages);
  //   formData.append('service_id', selectedService.id);
  //   formData.append('total_price', totalPrice);

  //   for (let i = 0; i < attachments.length; i++) {
  //     formData.append('attachments', attachments[i]);
  //   }

  //   fetch('http://127.0.0.1:5000/request_expert', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${authToken}` },
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error('Failed to submit the project request.');
  //       return response.json();
  //     })
  //     .then(() => {
  //       navigate('/payment/success', { state: { totalPrice, paymentRef } });
  //     })
  //     .catch(() => showError('There was an error submitting the project.'));
  // }, [
  //   projectTitle,
  //   description,
  //   selectedProjectType,
  //   selectedSubject,
  //   deadline,
  //   expertId,
  //   numberOfPages,
  //   selectedService,
  //   totalPrice,
  //   attachments,
  //   authToken,
  //   navigate,
  //   paymentRef,
  // ]);

  const handleClose = useCallback(() => {
    showError('Payment cancelled.');
  }, []);

  const componentProps = useMemo(() => ({
    email,
    amount: totalPrice * 100,
    currency: 'KES',
    metadata: { name: projectTitle, phone: '1234567890' },
    publicKey,
    text: 'Submit Project',
    onSuccess: handleSuccess,
    onClose: handleClose,
    reference: paymentRef,
  }), [email, totalPrice, projectTitle, publicKey, paymentRef, handleSuccess, handleClose]);

  return (
    <div className="container mx-auto p-8 bg-gray-300 shadow-md rounded-lg max-w-4xl m-6">
      <h2 className="text-2xl font-bold mb-4">Request Expert</h2>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={(e) => e.preventDefault()} >
                <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium">Project Title</label>
          <input
            type="text"
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
          <select
            id="projectType"
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Project Type</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        {/* Number of Pages */}
        <div>
          <label htmlFor="numberOfPages" className="block text-sm font-medium">Number of Pages</label>
          <input
            type="number"
            id="numberOfPages"
            value={numberOfPages}
            onChange={(e) => setNumberOfPages(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Attachments */}
        <div>
          <label htmlFor="attachments" className="block text-sm font-medium">Attachments</label>
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div>
            <label htmlFor="service" className="block text-sm font-medium">Select Service</label>
            <select
              id="service"
              value={selectedService ? selectedService.id : ''}
              onChange={(e) => {
                const service = services.find(s => s.id === parseInt(e.target.value));
                setSelectedService(service);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} - Base: ${service.base_price.toFixed(2)}, Per Page: ${service.price_per_page.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pricing Breakdown */}
        {selectedService && numberOfPages > 0 && (
          <div className="mt-4 p-3 bg-white rounded shadow">
            <h3 className="font-bold">Pricing Breakdown</h3>
            <p>Base Price: ${selectedService.base_price.toFixed(2)}</p>
            <p>Pages: {numberOfPages}</p>
            <p>Price per Page: ${selectedService.price_per_page.toFixed(2)}</p>
            <p className="font-bold text-lg">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
        )}

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex justify-center mt-6">
          <PaystackButton
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            {...componentProps}
            disabled={!isFormValid}
          />
        </div>
      </form>
    </div>
  );
};

export default ProjectRequest;
