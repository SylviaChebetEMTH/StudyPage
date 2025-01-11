// import React, { useState } from "react";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch("http://127.0.0.1:5000/auth/forgot_password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           setMessage("A reset link has been sent to your email.");
//         } else {
//           setMessage(data.error || "Failed to send reset link.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setMessage("An error occurred. Please try again later.");
//       });
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//         <label className="block mb-2 text-sm font-medium">
//           Enter your email to reset your password:
//         </label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email address"
//           className="w-full p-2 border rounded mb-4"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Send Reset Link
//         </button>
//       </form>
//       {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
//     </div>
//   );
// }


import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/auth/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("A reset link has been sent to your email.");
          toast.success('A reset link has been sent to your email!');
        } else {
          // If the email is not found
          if (data.error === "User not found") {
            setMessage("User not found. Would you like to sign up?");
            toast.error("User not found. Please sign up.");
          } else {
            setMessage(data.error || "Failed to send reset link.");
            toast.error(data.error || "Failed to send reset link.");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      });
  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2 text-sm font-medium">
          Enter your email to reset your password:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

      {/* Display "Proceed to Signup" button if the user is not found */}
      {message && message.includes("User not found") && (
        <button
          onClick={handleSignupRedirect}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Proceed to Signup
        </button>
      )}
      
      {/* Toast container for displaying the notifications */}
      <ToastContainer />
    </div>
  );
}
