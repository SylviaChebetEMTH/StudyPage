import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { PaystackButton } from 'react-paystack';
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';

const ProjectRequest = () => {
  const { currentUser } = useContext(UserContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTypes, setProjectTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [relatedSubjects, setRelatedSubjects] = useState([]); // New: Dynamically filtered subjects
  // const [selectedProjectType, setSelectedProjectType] = useState('');
  // const [selectedSubject, setSelectedSubject] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [expertId, setExpertId] = useState(state ? state.expertId : '');
  const [numberOfPages, setNumberOfPages] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { authToken } = useContext(UserContext);

  const API_URL = 'https://studypage.onrender.com';
  const publicKey = 'pk_test_00e40d5cd3e321a68b22aad7e1c42a62f8587d4c';
  const email = currentUser?.email || ''; 
  const [paymentRef] = useState(`ref_${Math.floor(Math.random() * 1000000000)}`);

  const selectedProjectType = localStorage.getItem("selectedProjectTypeId");
  const selectedSubject = localStorage.getItem("selectedSubjectId");

  const showError = (message) => {
    toast.error(message || "Something went wrong. Please try again.");
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  /** 📌 Step 1: Fetch Project Types */
  useEffect(() => {
    fetch(`${API_URL}/project-types`)
      .then((response) => response.json())
      .then(setProjectTypes)
      .catch(() => toast.error('Error fetching project types.'));
  }, []);

  /** 📌 Step 2: Fetch All Subjects */
  useEffect(() => {
    fetch(`${API_URL}/subjects`)
      .then((response) => response.json())
      .then(setSubjects)
      .catch(() => toast.error('Error fetching subjects.'));
  }, []);

  /** 📌 Step 3: Fetch Services & Update Related Subjects */
  useEffect(() => {
    if (selectedProjectType) {
      setIsLoading(true);
      fetch(`${API_URL}/services?project_type=${selectedProjectType}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.services || data.services.length === 0) {
            showError('No services found for the selected project type.');
            setServices([]);
            setRelatedSubjects([]);
          } else {
            setServices(data.services);
            setRelatedSubjects(
              subjects.filter(subj => data.services.some(svc => svc.subject_id === subj.id))
            );
            // setSelectedSubject(''); 
          }
        })
        .catch(() => showError('Error fetching services.'))
        .finally(() => setIsLoading(false));
    } else {
      setServices([]);
      setRelatedSubjects([]);
      // setSelectedSubject('');
    }
  }, [selectedProjectType, subjects]);

  /** 📌 Step 4: Fetch Service Details When Project Type & Subject Selected */
  useEffect(() => {
    if (selectedProjectType && selectedSubject) {
      fetch(`${API_URL}/services?project_type=${selectedProjectType}&subject=${selectedSubject}`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.services || data.services.length === 0) {
            showError('No services found for the selected criteria.');
            setServices([]);
            setSelectedService(null);
          } else {
            setServices(data.services);
            setSelectedService(data.services[0]);
          }
        })
        .catch(() => showError('Error fetching services.'));
    }
  }, [selectedProjectType, selectedSubject]);

  /** 📌 Step 5: Calculate Total Price */
  useEffect(() => {
    if (selectedService && numberOfPages) {
      const calculatedPrice = selectedService.base_price + selectedService.price_per_page * parseFloat(numberOfPages);
      setTotalPrice(calculatedPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedService, numberOfPages]);

  const isFormValid = useMemo(() => {
    return !!(
      projectTitle &&
      description &&
      selectedProjectType &&
      selectedSubject &&
      deadline &&
      expertId &&
      numberOfPages &&
      attachments.length > 0
    );
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
    setIsLoading(true);
    toast.info("Processing your request, please wait...");

    try {
      // Step 1: Verify Payment
      const verifyResponse = await fetch(`${API_URL}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: response.reference,
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

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed. Please try again.");
      }

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        throw new Error(verifyData.message || "Payment verification unsuccessful.");
      }

      // Step 2: Submit Project
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

      attachments.forEach((file) => formData.append("attachments[]", file));

      const projectResponse = await fetch(`${API_URL}/request_expert`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!projectResponse.ok) {
        throw new Error("Failed to submit the project request.");
      }

      toast.success("Project submitted successfully! Redirecting...");
      setTimeout(() => {
        navigate("/chat", { state: { totalPrice, reference: response.reference } });
      }, 2000);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
    navigate,
    authToken
  ]);

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

      <form onSubmit={(e) => e.preventDefault()}>
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

        {/* Project Type Selection */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium">Project Type</label>
          <select
            id="projectType"
            value={selectedProjectType}
            // onChange={(e) => setSelectedProjectType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Project Type</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Related Subjects (Filtered by Project Type) */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
          <select
            id="subject"
            value={selectedSubject}
            // onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!selectedProjectType}
            required
          >
            <option value="">Select Subject</option>
            {relatedSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

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
          {attachments.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Selected Files:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
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
            <div className="mb-6 p-4 bg-gray-100 border-l-4 border-blue-500 rounded-lg shadow-md">
              <h4 className="text-lg font-bold text-gray-800">🔒 Protected Payments with Escrow</h4>
              <p className="text-gray-600 text-sm">
                Our platform uses an escrow system to protect your payments. Funds are only released to the Experts 
                when it's confirmed that the work meets your expectations.
              </p>
            </div>
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

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          {isLoading ? (
            <div className="flex items-center">
              <span className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
              <span className="ml-2 text-blue-500 font-semibold">Processing...</span>
            </div>
          ) : (
            <PaystackButton
              className={`bg-blue-500 text-white p-2 rounded ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition duration-200"
              }`}
              {...componentProps}
              disabled={!isFormValid}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectRequest;
