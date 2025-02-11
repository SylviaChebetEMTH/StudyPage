import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSuccess("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-300 text-gray-800 min-h-screen py-8 px-4 md:px-16  flex flex-col items-center justify-center ">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-500 mb-6">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We'd love to hear from you! Fill out the form below and we'll get back to you soon.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-yellow-500"
          ></textarea>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            <strong>Email:</strong> contact@studypage.cloud
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +123 456 7890
          </p>
          <p className="text-gray-600">
            <strong>Address:</strong> 123 StudyPage Street, Knowledge City
          </p>
        </div>

        {/* Google Map Embed (Optional) */}
        <div className="mt-8">
          <iframe
            className="w-full h-64 rounded-lg shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31693.692730399665!2d36.8219!3d-1.2863899999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10f6eac73fd1%3A0xf34c9a3e3c2a1e18!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1712123456789"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
