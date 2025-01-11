import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import facebookIcon from './assets/facebookIcon.png';
import instagramIcon from './assets/instagramIcon.png';
import twitterIcon from './assets/twitterIcon.png';
import youtubeIcon from './assets/youtubeIcon.png';
import AOS from "aos";
import "aos/dist/aos.css";

const Footer = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 md:px-16">
      <div className="max-w-screen-lg mx-auto">
        {/* Join Us Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-6 mb-6">
          <div className="mb-6 md:mb-0">
            <h3 data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="0" className="text-2xl font-bold text-white">Join Us</h3>
            <p data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="300" className="text-gray-400 mt-2">
              We'll send you Daily special offers.
            </p>
          </div>
          <div className="flex flex-col">
            <form data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="0" className="flex items-center">
              <input
                type="email"
                placeholder="studypage001@gmail.com"
                className="p-2 rounded-l-md border-none text-gray-700 w-64 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-r-md hover:bg-yellow-400"
              >
                Subscribe
              </button>
            </form>
            <p data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="300" className="text-gray-400 mt-2">
              We care about your data. Check our <span><Link to='/privacy_policy' className="underline">privacy policy</Link></span>.
            </p>

          </div>
        </div>

        {/* Navigation Links */}
        <div data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="300" className="flex flex-col md:flex-row justify-between items-center text-sm mb-6">
          <div  className="text-lg font-bold text-white">
            <span className="text-yellow-500">Study</span>Page
          </div>
          <div  className="flex space-x-6 text-gray-400 mt-4 md:mt-0">
            <Link to="/overview" className="hover:text-gray-200 cursor-pointer">Overview</Link>
            <Link to="/features" className="hover:text-gray-200 cursor-pointer">Features</Link>
            <Link to="/pricing" className="hover:text-gray-200 cursor-pointer">Pricing</Link>
            <Link to="/help" className="hover:text-gray-200 cursor-pointer">Help</Link>

            <Link to="https://sites.google.com/view/studypage-cloud/home" className="hover:text-gray-200 cursor-pointer">
              Privacy Policy
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400">
              <img src={instagramIcon} alt="Instagram" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400">
              <img src={youtubeIcon} alt="YouTube" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400">
              <img src={twitterIcon} alt="Twitter" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400">
              <img src={facebookIcon} alt="Facebook" className="h-5 w-5 md:h-6 md:w-6" />
            </a>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-500 text-sm">
          <hr className="border-gray-700 mb-4" />
          <p>Copyright &copy; _2024 STUDYPAGE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
