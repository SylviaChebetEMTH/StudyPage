// import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { UserContext } from '../contexts/userContext';
// import { PaystackButton } from 'react-paystack';
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from 'react-toastify';

// const ProjectRequest = () => {
//   const { currentUser } = useContext(UserContext);
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [projectTitle, setProjectTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [projectTypes, setProjectTypes] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [relatedSubjects, setRelatedSubjects] = useState([]); // New: Dynamically filtered subjects
//   // const [selectedProjectType, setSelectedProjectType] = useState('');
//   // const [selectedSubject, setSelectedSubject] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [deadline, setDeadline] = useState('');
//   const [expertId, setExpertId] = useState(state ? state.expertId : '');
//   const [numberOfPages, setNumberOfPages] = useState('');
//   const [services, setServices] = useState([]);
//   const [selectedService, setSelectedService] = useState(null);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const { authToken } = useContext(UserContext);

//   const API_URL = 'https://studypage.onrender.com';
//   const publicKey = 'pk_test_00e40d5cd3e321a68b22aad7e1c42a62f8587d4c';
//   const email = currentUser?.email || ''; 
//   const [paymentRef] = useState(`ref_${Math.floor(Math.random() * 1000000000)}`);

//   const selectedProjectType = localStorage.getItem("selectedProjectTypeId");
//   const selectedSubject = localStorage.getItem("selectedSubjectId");

//   const showError = (message) => {
//     toast.error(message || "Something went wrong. Please try again.");
//   };

//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
//   };

//   /** 📌 Step 1: Fetch Project Types */
//   useEffect(() => {
//     fetch(`${API_URL}/project-types`)
//       .then((response) => response.json())
//       .then(setProjectTypes)
//       .catch(() => toast.error('Error fetching project types.'));
//   }, []);

//   /** 📌 Step 2: Fetch All Subjects */
//   useEffect(() => {
//     fetch(`${API_URL}/subjects`)
//       .then((response) => response.json())
//       .then(setSubjects)
//       .catch(() => toast.error('Error fetching subjects.'));
//   }, []);

//   /** 📌 Step 3: Fetch Services & Update Related Subjects */
//   useEffect(() => {
//     if (selectedProjectType) {
//       setIsLoading(true);
//       fetch(`${API_URL}/services?project_type=${selectedProjectType}`)
//         .then((response) => response.json())
//         .then((data) => {
//           if (!data.services || data.services.length === 0) {
//             showError('No services found for the selected project type.');
//             setServices([]);
//             setRelatedSubjects([]);
//           } else {
//             setServices(data.services);
//             setRelatedSubjects(
//               subjects.filter(subj => data.services.some(svc => svc.subject_id === subj.id))
//             );
//             // setSelectedSubject(''); 
//           }
//         })
//         .catch(() => showError('Error fetching services.'))
//         .finally(() => setIsLoading(false));
//     } else {
//       setServices([]);
//       setRelatedSubjects([]);
//       // setSelectedSubject('');
//     }
//   }, [selectedProjectType, subjects]);

//   /** 📌 Step 4: Fetch Service Details When Project Type & Subject Selected */
//   useEffect(() => {
//     if (selectedProjectType && selectedSubject) {
//       fetch(`${API_URL}/services?project_type=${selectedProjectType}&subject=${selectedSubject}`)
//         .then((response) => response.json())
//         .then((data) => {
//           if (!data.services || data.services.length === 0) {
//             showError('No services found for the selected criteria.');
//             setServices([]);
//             setSelectedService(null);
//           } else {
//             setServices(data.services);
//             setSelectedService(data.services[0]);
//           }
//         })
//         .catch(() => showError('Error fetching services.'));
//     }
//   }, [selectedProjectType, selectedSubject]);

//   /** 📌 Step 5: Calculate Total Price */
//   useEffect(() => {
//     if (selectedService && numberOfPages) {
//       const calculatedPrice = selectedService.base_price + selectedService.price_per_page * parseFloat(numberOfPages);
//       setTotalPrice(calculatedPrice);
//     } else {
//       setTotalPrice(0);
//     }
//   }, [selectedService, numberOfPages]);

//   const isFormValid = useMemo(() => {
//     return !!(
//       projectTitle &&
//       description &&
//       selectedProjectType &&
//       selectedSubject &&
//       deadline &&
//       expertId &&
//       numberOfPages &&
//       attachments.length > 0
//     );
//   }, [
//     projectTitle,
//     description,
//     selectedProjectType,
//     selectedSubject,
//     deadline,
//     expertId,
//     numberOfPages,
//     attachments,
//   ]);

//   const handleSuccess = useCallback(async (response) => {
//     setIsLoading(true);
//     toast.info("Processing your request, please wait...");

//     try {
//       // Step 1: Verify Payment
//       const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           reference: response.reference,
//           projectDetails: {
//             projectTitle,
//             description,
//             selectedProjectType,
//             selectedSubject,
//             deadline,
//             expertId,
//             numberOfPages,
//             selectedServiceId: selectedService?.id,
//             totalPrice,
//           },
//         }),
//       });

//       if (!verifyResponse.ok) {
//         throw new Error("Payment verification failed. Please try again.");
//       }

//       const verifyData = await verifyResponse.json();

//       if (!verifyData.success) {
//         throw new Error(verifyData.message || "Payment verification unsuccessful.");
//       }

//       // Step 2: Submit Project
//       const formData = new FormData();
//       formData.append("project_title", projectTitle);
//       formData.append("project_description", description);
//       formData.append("project_type", selectedProjectType);
//       formData.append("subject", selectedSubject);
//       formData.append("deadline", deadline);
//       formData.append("expert_id", expertId);
//       formData.append("number_of_pages", numberOfPages);
//       formData.append("service_id", selectedService?.id);
//       formData.append("total_price", totalPrice);
//       formData.append("sender_type", "user");
//       formData.append("receiver_type", "expert");

//       attachments.forEach((file) => formData.append("attachments[]", file));

//       const projectResponse = await fetch(`${API_URL}/request_expert`, {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (!projectResponse.ok) {
//         throw new Error("Failed to submit the project request.");
//       }

//       toast.success("Project submitted successfully! Redirecting...");
//       setTimeout(() => {
//         navigate("/chat", { state: { totalPrice, reference: response.reference } });
//       }, 2000);
//     } catch (error) {
//       toast.error(error.message || "An unexpected error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     projectTitle,
//     description,
//     selectedProjectType,
//     selectedSubject,
//     deadline,
//     expertId,
//     numberOfPages,
//     selectedService,
//     totalPrice,
//     attachments,
//     navigate,
//     authToken
//   ]);

//   const handleClose = useCallback(() => {
//     showError('Payment cancelled.');
//   }, []);

//   const componentProps = useMemo(() => ({
//     email,
//     amount: totalPrice * 100,
//     currency: 'KES',
//     metadata: { name: projectTitle, phone: '1234567890' },
//     publicKey,
//     text: 'Submit Project',
//     onSuccess: handleSuccess,
//     onClose: handleClose,
//     reference: paymentRef,
//   }), [email, totalPrice, projectTitle, publicKey, paymentRef, handleSuccess, handleClose]);

//   return (
//     <div className="container mx-auto p-8 bg-gray-300 shadow-md rounded-lg max-w-4xl m-6">
//       <h2 className="text-2xl font-bold mb-4">Request Expert</h2>

//       <form onSubmit={(e) => e.preventDefault()}>
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

//         {/* Project Type Selection */}
//         <div>
//           <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
//           <select
//             id="projectType"
//             value={selectedProjectType}
//             // onChange={(e) => setSelectedProjectType(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           >
//             <option value="">Select Project Type</option>
//             {projectTypes.map((type) => (
//               <option key={type.id} value={type.id}>{type.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Related Subjects (Filtered by Project Type) */}
//         <div>
//           <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
//           <select
//             id="subject"
//             value={selectedSubject}
//             // onChange={(e) => setSelectedSubject(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             disabled={!selectedProjectType}
//             required
//           >
//             <option value="">Select Subject</option>
//             {relatedSubjects.map((subject) => (
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
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>

//         {/* Attachments */}
//         <div>
//           <label htmlFor="attachments" className="block text-sm font-medium">Attachments</label>
//           <input
//             type="file"
//             id="attachments"
//             multiple
//             onChange={handleFileChange}
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           {attachments.length > 0 && (
//             <div className="mt-2">
//               <p className="font-medium">Selected Files:</p>
//               <ul className="list-disc pl-5 text-sm text-gray-700">
//                 {attachments.map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Services */}
//         {services.length > 0 && (
//           <div>
//             <label htmlFor="service" className="block text-sm font-medium">Select Service</label>
//             <select
//               id="service"
//               value={selectedService ? selectedService.id : ''}
//               onChange={(e) => {
//                 const service = services.find(s => s.id === parseInt(e.target.value));
//                 setSelectedService(service);
//               }}
//               className="w-full p-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select a Service</option>
//               {services.map((service) => (
//                 <option key={service.id} value={service.id}>
//                   {service.title} - Base: ${service.base_price.toFixed(2)}, Per Page: ${service.price_per_page.toFixed(2)}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Pricing Breakdown */}
//         {selectedService && numberOfPages > 0 && (
//           <div className="mt-4 p-3 bg-white rounded shadow">
//             <div className="mb-6 p-4 bg-gray-100 border-l-4 border-blue-500 rounded-lg shadow-md">
//               <h4 className="text-lg font-bold text-gray-800">🔒 Protected Payments with Escrow</h4>
//               <p className="text-gray-600 text-sm">
//                 Our platform uses an escrow system to protect your payments. Funds are only released to the Experts 
//                 when it's confirmed that the work meets your expectations.
//               </p>
//             </div>
//             <h3 className="font-bold">Pricing Breakdown</h3>
//             <p>Base Price: ${selectedService.base_price.toFixed(2)}</p>
//             <p>Pages: {numberOfPages}</p>
//             <p>Price per Page: ${selectedService.price_per_page.toFixed(2)}</p>
//             <p className="font-bold text-lg">Total Price: ${totalPrice.toFixed(2)}</p>
//           </div>
//         )}

//         {/* Deadline */}
//         <div>
//           <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
//           <input
//             type="date"
//             id="deadline"
//             value={deadline}
//             onChange={(e) => setDeadline(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-center mt-6">
//           {isLoading ? (
//             <div className="flex items-center">
//               <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
//               <span className="ml-2 text-blue-500 font-semibold">Processing...</span>
//             </div>
//           ) : (
//             <PaystackButton
//               className={`bg-blue-500 text-white p-2 rounded ${
//                 !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition duration-200"
//               }`}
//               {...componentProps}
//               disabled={!isFormValid}
//             />
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectRequest;





import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { PaystackButton } from "react-paystack";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ProjectRequest = () => {
  const { currentUser, authToken } = useContext(UserContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const API_URL = "https://studypage.onrender.com";
  const publicKey = "pk_live_9d093b52e09ff0b847d1e490f6ad1f1add87c150";
  const email = currentUser?.email || "";
  const [paymentRef] = useState(`ref_${Math.floor(Math.random() * 1000000000)}`);

  // Form state
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [expertId, setExpertId] = useState(state?.expertId || "");
  const [numberOfPages, setNumberOfPages] = useState("");
  const [step, setStep] = useState(1); // For multi-step form
  
  // Data state
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the selected IDs from localStorage
  const selectedProjectTypeId = localStorage.getItem("selectedProjectTypeId");
  const selectedSubjectId = localStorage.getItem("selectedSubjectId");
  
  // State to store the names of selected project type and subject
  const [selectedProjectTypeName, setSelectedProjectTypeName] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("");

  const showError = (message) => toast.error(message || "Something went wrong. Please try again.");
  const showSuccess = (message) => toast.success(message || "Operation completed successfully.");

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Fetch project types
  useEffect(() => {
    fetch(`${API_URL}/project-types`)
      .then((response) => response.json())
      .then((data) => {
        setProjectTypes(data);
        // Find and set the name of the selected project type
        if (selectedProjectTypeId) {
          const selectedType = data.find(type => type.id.toString() === selectedProjectTypeId.toString());
          if (selectedType) {
            setSelectedProjectTypeName(selectedType.name);
          }
        }
      })
      .catch(() => showError("Error fetching project types."));
  }, [selectedProjectTypeId]);

  // Fetch subjects
  useEffect(() => {
    fetch(`${API_URL}/subjects`)
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        // Find and set the name of the selected subject
        if (selectedSubjectId) {
          const selectedSubj = data.find(subj => subj.id.toString() === selectedSubjectId.toString());
          if (selectedSubj) {
            setSelectedSubjectName(selectedSubj.name);
          }
        }
      })
      .catch(() => showError("Error fetching subjects."));
  }, [selectedSubjectId]);

  // Fetch services for selected project type and subject
  useEffect(() => {
    if (selectedProjectTypeId && selectedSubjectId) {
      setIsLoading(true);
      fetch(`${API_URL}/services?project_type=${selectedProjectTypeId}&subject=${selectedSubjectId}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.services || data.services.length === 0) {
            showError("No services found for the selected criteria.");
            setServices([]);
          } else {
            setServices(data.services);
            setSelectedService(data.services[0]);
          }
        })
        .catch(() => showError("Error fetching services."))
        .finally(() => setIsLoading(false));
    }
  }, [selectedProjectTypeId, selectedSubjectId]);

  // Calculate total price
  useEffect(() => {
    if (selectedService && numberOfPages) {
      const calculatedPrice =
        selectedService.base_price + selectedService.price_per_page * parseFloat(numberOfPages);
      setTotalPrice(calculatedPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedService, numberOfPages]);

  const isStep1Valid = useMemo(() => {
    return !!(projectTitle && description && deadline && expertId && numberOfPages && selectedService);
  }, [projectTitle, description, deadline, expertId, numberOfPages, selectedService]);
  
  const isStep2Valid = useMemo(() => {
    return attachments.length >= 0;
  }, [attachments]);

  const isFormValid = useMemo(() => {
    return isStep1Valid && isStep2Valid;
  }, [isStep1Valid, isStep2Valid]);

  const handleSuccess = useCallback(
    async (response) => {
      setIsLoading(true);
      toast.info("Processing your request, please wait...");

      try {
        // Step 1: Optional - Verify Payment (if you have a verification endpoint)
        const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: response.reference,
            projectDetails: {
              projectTitle,
              description,
              selectedProjectType: selectedProjectTypeId,
              selectedSubject: selectedSubjectId,
              deadline,
              expertId,
              numberOfPages,
              selectedServiceId: selectedService?.id,
              totalPrice,
            },
          }),
        });

        if (!verifyResponse.ok) {
          throw new Error("Payment verification failed. Please try again.");
        }

        // Step 2: Submit Project
        const formData = new FormData();
        formData.append("project_title", projectTitle);
        formData.append("project_description", description);
        formData.append("project_type", selectedProjectTypeId);
        formData.append("subject", selectedSubjectId);
        formData.append("deadline", deadline);
        formData.append("expert_id", expertId);
        formData.append("number_of_pages", numberOfPages);
        formData.append("service_id", selectedService?.id);
        formData.append("total_price", totalPrice);
        formData.append("sender_type", "user");
        formData.append("receiver_type", "expert");

        attachments.forEach((file) => formData.append("attachments[]", file));
        console.log('here is the form data before sending', attachments)

        const projectResponse = await fetch(`${API_URL}/request_expert`, {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!projectResponse.ok) {
          throw new Error("Failed to submit the project request.");
        }

        showSuccess("Project submitted successfully! Redirecting...");
        setTimeout(() => {
          navigate("/chat", { state: { totalPrice, reference: response.reference } });
        }, 2000);
      } catch (error) {
        showError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      projectTitle, 
      description, 
      selectedProjectTypeId, 
      selectedSubjectId, 
      deadline, 
      expertId, 
      numberOfPages, 
      selectedService, 
      totalPrice, 
      attachments, 
      navigate, 
      authToken
    ]
  );

  const componentProps = useMemo(
    () => ({
      email,
      amount: totalPrice * 100,
      currency: "USD",
      metadata: { name: projectTitle, phone: currentUser?.phone || "N/A" },
      publicKey,
      text: isLoading ? "Processing..." : "Submit Project",
      onSuccess: handleSuccess,
      onClose: () => showError("Payment cancelled."),
      reference: paymentRef,
      disabled: !isFormValid || isLoading,
      className: `w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
        !isFormValid || isLoading 
          ? "bg-blue-300 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700"
      }`,
    }),
    [email, totalPrice, projectTitle, publicKey, paymentRef, handleSuccess, isFormValid, isLoading, currentUser]
  );

  // Function to handle next step
  const handleNextStep = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    }
  };

  // Function to handle previous step
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg my-4  md:my-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Submit Project  
      </h2>
      
      {/* Progress indicator */}
      <div className="mb-8">
  <div className="flex items-center justify-between">
    {/* Step 1 */}
    <div className="flex flex-col items-center relative">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
        1
      </div>
      <span className="text-xs mt-1">Project Details</span>
      {/* {step === 1 && (
        <div className="absolute top-10 text-center text-sm text-gray-600 bg-white p-2 rounded-lg shadow-lg">
          Fill in your project details.
        </div>
      )} */}
    </div>
    {/* Step 2 */}
    <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
    <div className="flex flex-col items-center relative">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
        2
      </div>
      <span className="text-xs mt-1">Upload Files</span>
      {/* {step === 2 && (
        <div className="absolute top-10 text-center text-sm text-gray-600 bg-white p-2 rounded-lg shadow-lg">
          Upload necessary files for your project.
        </div>
      )} */}
    </div>
    {/* Step 3 */}
    <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
    <div className="flex flex-col items-center relative">
      <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
        3
      </div>
      <span className="text-xs mt-1">Payment</span>
      {step === 3 && (
        <div className="absolute top-10 text-center text-sm text-gray-600 bg-white p-2 rounded-lg shadow-lg">
          Complete payment to start your project.
        </div>
      )}
    </div>
  </div>
</div>
      
      {/* Project Type and Subject Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Project Type</h3>
          <p className="text-lg font-semibold text-gray-800"> {services.map((service) => (
                  <option className="text-lg font-semibold text-gray-800" key={service.id} value={service.id}>
                    {service.unit }
                  </option>
                ))}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Subject</h3>
          <p className="text-lg font-semibold text-gray-800">{selectedSubjectName || "Not selected"}</p>
        </div>
      </div>

      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" 
              placeholder="Enter a clear title for your project"
              required
            />
            {/* {!projectTitle && (
              <p className="text-red-500 text-sm mt-1">Project title is required.</p>
            )} */}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Describe your project requirements in detail"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Number of Pages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Pages <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={numberOfPages} 
                onChange={(e) => setNumberOfPages(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Enter number of pages"
                min="1"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" 
              />
            </div>
          </div>

          {/* Services Selection */}
          {services.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Service <span className="text-red-500">*</span></label>
              <select
                value={selectedService ? selectedService.id : ""}
                onChange={(e) => {
                  const service = services.find((s) => s.id === parseInt(e.target.value));
                  setSelectedService(service);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select a Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} - Base: ${service.base_price.toFixed(2)}, Per Page: $
                    {service.price_per_page.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-8 flex justify-end">
          <button
            onClick={handleNextStep}
            disabled={!isStep1Valid}
            className={`py-3 px-6 rounded-lg font-medium text-white transition duration-200 flex items-center justify-center ${
              !isStep1Valid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Next Step
          </button>
          </div>
        </div>
      )}

      {/* Step 2: Attachments */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Attachments */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachments <span className="text-sm text-gray-400">(optional)</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center transition hover:border-blue-500 hover:bg-blue-50 relative">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">Drag and drop your files here</p>
              <p className="mb-4 text-xs text-gray-400">Documents, PDFs, images, or any relevant files</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Browse Files
              </button>
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="w-full h-full cursor-pointer opacity-0 absolute inset-0" 
              />
            </div>
            
            {/* File list */}
            {attachments.length > 0 && (
              <>
                <h4 className="font-medium text-gray-700 mt-6 mb-2">Uploaded Files ({attachments.length})</h4>
                <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg border border-gray-200">
                  {attachments.map((file, index) => (
                    <li key={index} className="py-3 px-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <div>
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-gray-500 block">{(file.size / 1024).toFixed(2)} KB</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeAttachment(index)} 
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Pricing Breakdown */}
          {selectedService && numberOfPages > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm mt-6">
              <div className="mb-4 pb-4 border-b border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Protected Payments with Escrow
                </h4>
                <p className="text-blue-600 text-sm mt-2">
                  Our platform uses an escrow system to protect your payments. Funds are only released to the Experts 
                  when it's confirmed that the work meets your expectations.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm mt-6">
              <h3 className="font-bold text-gray-700 mb-3">Pricing Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-white p-2 rounded hover:bg-blue-50 transition duration-200 cursor-pointer">
                  <span className="font-medium">Base Price:</span>
                  <span className="text-blue-800 font-medium">${selectedService.base_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded hover:bg-blue-50 transition duration-200 cursor-pointer">
                  <span className="font-medium">Pages:</span>
                  <span className="text-blue-800 font-medium">{numberOfPages}</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded hover:bg-blue-50 transition duration-200 cursor-pointer">
                  <span className="font-medium">Price per Page:</span>
                  <span className="text-blue-800 font-medium">${selectedService.price_per_page.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-3 border-t border-blue-200">
                  <span>Total Price:</span>
                  <span className="text-blue-800">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* Back and Next Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Back Button */}
          <button
            onClick={handlePrevStep}
            className="flex items-center justify-center w-full sm:w-auto py-3 px-6 rounded-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>

          {/* Payment Button - Active */}
          <div className="w-full sm:w-auto">
            <PaystackButton 
              {...componentProps} 
              className="w-full sm:w-auto py-3 px-6 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition duration-200" 
            />
          </div>
        </div>

        </div>
      )}
    </div>
  );
};

export default ProjectRequest;
