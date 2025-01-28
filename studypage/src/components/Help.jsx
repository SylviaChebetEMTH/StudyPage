import React from "react";

const Help = () => {
  return (
    <section className="bg-gray-50 text-gray-800 min-h-screen py-8 px-4 md:px-16">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        {/* Header Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-500 mb-6">
          Need Help? We're Here for You!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Have questions or need assistance? Contact our support team, and we'll get back to you as soon as possible.
        </p>

        {/* Additional Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Prefer direct contact?</p>
          <a href="mailto:help@studypage.cloud" className="text-yellow-500 hover:underline">
            help@studypage.cloud
          </a>
          <p className="text-gray-600 mt-2">Call us: +123 456 789</p>
        </div>
      </div>
    </section>
  );
};

export default Help;
