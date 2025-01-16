import React from "react";
import aboutVideo from './assets/aboutVideo.mp4'

const About = () => {

  const handleVideoEnd = (e) => {
    e.target.play(); 
  };
  return (
    <div>
      <main className="w-full">
        
        <div className="header relative">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-[calc(100vh-5rem)] object-cover -z-10"
            onEnded={handleVideoEnd}
          >
            <source
              src={aboutVideo}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="relative z-10">
            <div style={{ height: 500 }}>
              <p className="text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] uppercase font-extralight text-white text-8xl">
                StudyPage
              </p>
            </div>
          </div>
        </div>

        <div className="wrapper">
          <div className="my-8 text-center">
            <p className="tracking-widest font-semibold uppercase text-xl p-5 text-black">
              StudyPage - Empowering Your Learning Journey!
            </p>
            <p className="text-2xl px-8 sm:px-16 md:px-24 lg:px-[20rem] pb-5 font-extralight">
              Unlock your potential and achieve academic success with StudyPage - where learning is not just a task, but an inspiring experience.
            </p>
            <p className="px-6 sm:px-12 md:px-16 lg:px-[7rem] pb-2 text-xl font-light">
              Welcome to StudyPage, your ultimate destination for comprehensive study resources. Our journey started with a mission: to provide students, educators, and lifelong learners with the tools they need to excel in their academic endeavors.
              We believe in fostering a community of knowledge and growth, where everyone has access to expert guidance, useful tips, and relevant study materials.
              Your feedback and suggestions matter to us. They inspire us to enhance our platform and continuously innovate, ensuring that we meet the evolving needs of our users. We are committed to supporting your learning journey every step of the way.
              Whether you're preparing for exams, exploring new learning strategies, or looking for academic assistance, StudyPage is here to help you succeed. Thank you for being a part of StudyPage. We are excited to support you in achieving your educational goals! 📚
            </p>
          </div>
        </div>

        <div className="bg-gray-100 py-16">
          <div className="text-center mb-12">
            <p className="text-3xl font-semibold text-gray-800">Our Core Values</p>
            <p className="text-lg text-gray-600 mt-4">
              At StudyPage, we are guided by values that drive our commitment to providing a high-quality learning experience for all.
            </p>
          </div>
          <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Empowerment</p>
              <p className="text-gray-600 mt-4">
                We believe in empowering students with the tools and resources they need to achieve academic success and reach their full potential.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Collaboration</p>
              <p className="text-gray-600 mt-4">
                We foster a collaborative learning environment where students, educators, and learners support each other in their educational journeys.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Innovation</p>
              <p className="text-gray-600 mt-4">
                We continuously innovate to offer the best study tools, resources, and strategies, adapting to the ever-changing educational landscape.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Accessibility</p>
              <p className="text-gray-600 mt-4">
                We strive to make learning accessible to everyone, regardless of their location or background, by providing inclusive resources.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Integrity</p>
              <p className="text-gray-600 mt-4">
                We operate with integrity and transparency, ensuring that students and educators can trust the resources and information we provide.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-gray-600">Continuous Growth</p>
              <p className="text-gray-600 mt-4">
                We are committed to continuous learning and growth, both for our platform and for the students we serve, adapting to their needs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
