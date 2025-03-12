import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./components/contexts/userContext";
import { UserContext } from "./components/contexts/userContext";
import { NavBar } from "./components/NavBar";
import Home from "./components/Home";
import About from "./components/About";
import ExpertPage from "./components/Experts";
import Services from "./components/Services";
import Login from "./components/forms/Login";
import SignUp from "./components/forms/Signup";
import AdminNav from "./components/admin/AdminNav";
import AdminDashboardSidebar from "./components/admin/AdminDashboard";
import AllUsers from "./components/admin/AdminUsers";
import AdminDasboardStats from "./components/admin/AdminDashboardStats";
import AllExperts from "./components/admin/AllExperts";
import AddExpertPage from "./components/admin/AddExpert";
import AllServices from "./components/admin/AllServices";
import Projects from "./components/admin/Projects";
import AddServicePage from "./components/admin/AddService";
import ProjectTypes from "./components/admin/ProjectTypes";
import SubjectArea from "./components/admin/SubjectArea";
import ProjectRequest from "./components/forms/ProjectRequest";
import UserProfile from "./components/user/UserProfileSideBar";
import ProjectSummary from "./components/user/ProjectSummary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./components/user/Messaging";
// import AdminPanel from "./components/adminChat/AdminPanel";
import ResetPassword from "./components/forms/ResetPassword";
import UpdateProfile from "./components/forms/UpdateProfile";
import UserDashboard from "./components/user/UserDashboard";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Help from "./components/Help";
import ForgotPassword from "./components/forms/ForgotPassword";
import { SocketProvider } from "./components/contexts/SocketContext";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./components/ContactUs";
import ExpertsPage from "./components/ExpertsPage";

function AppContent() {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col ">

      {/* {!isAuthPage && (isAdminPage ? <AdminNav /> : <NavBar />)} */}
      <div className="flex-grow">
        <ToastContainer 
          position="top-right"
          autoClose={3000}  // Ensures all toasts auto-close
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnHover={false} // Prevents persistence when hovering
          draggable
          theme="light"
        />
        {/* <NavBar /> */}
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/expertspage" element={<ExpertPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/hireexpert" element={<ProjectRequest />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/adminchat" element={<AdminPanel />} />
        </Routes> */}
        <SocketProvider>
          <div className="min-h-screen flex flex-col ">
            {!isAuthPage && (isAdminPage ? <AdminNav /> : <NavBar />)}
            <div className="flex-grow">
              {/* <ToastContainer /> */}
              {/* <NavBar /> */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/reset_password/:token" element={<ResetPassword />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/updateprofile" element={<UpdateProfile />} />
                <Route path="/expertspage" element={<ExpertPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/footer" element={<Footer />} />
                <Route path="/hireexpert" element={<ProjectRequest />} />
                <Route path="/all_experts" element={<ExpertsPage />} />
                {/* <Route path="/projects" element={<Projects />} /> */}
                <Route path="/chat" element={<Chat />} />
                {/* <Route path="/adminchat" element={<AdminPanel />} /> */}
                {/* Only render admin routes if the user is an admin */}
                {currentUser?.is_admin && (
                  <Route path="/admin" element={<AdminDashboardSidebar />}>
                    <Route path="dashboard" element={<AdminDasboardStats />} />
                    <Route path="users" element={<AllUsers />} />
                    <Route path="allexperts" element={<AllExperts />} />
                    <Route path="addexpert" element={<AddExpertPage />} />
                    <Route path="allservices" element={<AllServices />} />
                    <Route path="addservice" element={<AddServicePage />} />
                    <Route path="projecttypes" element={<ProjectTypes />} />
                    <Route path="subjectarea" element={<SubjectArea />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="*" element={<div>Page not found</div>} />
                  </Route>
                )}
                {!currentUser?.is_admin && (
                  <Route path="/userprofile" element={<UserProfile />}>
                    <Route path="hireexpert" element={<ProjectRequest />} />
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="projectsummary" element={<ProjectSummary />} />
                  </Route>
                )}
              </Routes>
            </div>
            {/* <Footer /> */}
          </div>
        </SocketProvider>

      </div>
    </div>
  )
}
const App = () => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const userContextValue = {
    user,
    setUser,
    authToken,
    setAuthToken,
  };
  const clientId =
    "854474486915-lncgkai7f4jca5fqe4v7ma0flkftdd5k.apps.googleusercontent.com";
  return (
    <UserContext.Provider value={userContextValue}>
      <SocketProvider>
        <Router>
          <GoogleOAuthProvider clientId={clientId}>
            <UserProvider>
              <AppContent />
            </UserProvider>
          </GoogleOAuthProvider>
        </Router>
      </SocketProvider>
    </UserContext.Provider>
  );
};

export default App;
