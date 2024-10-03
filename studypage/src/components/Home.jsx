import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-photo/young-student-sitting-university-library-break-from-studying_496169-1232.jpg?t=st=1727969795~exp=1727973395~hmac=a4ebdf76a64d3ab12cb8c85b7edea028ac7516b9462538ab0d7cc1ff8377c012&w=740)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to StudyPage
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Your one-stop platform for all study resources. Learn, Grow, Succeed!
          </p>
          <Link to="/explore">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
              Explore Resources
            </button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose StudyPage?</h2>
          <p className="text-lg text-gray-700 mb-8">
            At StudyPage, we provide a curated collection of study materials,
            guides, and tips to help you achieve academic success. Whether you
            are preparing for exams or seeking new learning techniques, we have
            everything you need to excel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Guides</h3>
              <p className="text-gray-600">
                Access in-depth study guides and materials on a variety of subjects.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Expert Tips</h3>
              <p className="text-gray-600">
                Learn from experts with practical tips to boost your study
                efficiency.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">24/7 Access</h3>
              <p className="text-gray-600">
                Get access to all resources anytime, anywhere, on any device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
