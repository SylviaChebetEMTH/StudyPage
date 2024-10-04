import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { UserProvider } from './components/contexts/userContext';
import { UserContext } from "./components/contexts/userContext";
import { NavBar } from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import ExpertPage from "./components/Experts";
import Services from './components/Services';
import Login from './components/forms/Login';
import SignUp from './components/forms/Signup';
import AdminNav from "./components/admin/AdminNav";
// import Dashboard from "./components/admin/AdminDashboard";
import AdminDashboardSidebar from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminDasboardStats from "./components/admin/AdminDashboardStats";
import AllExperts from "./components/admin/AllExperts";
import AddExpertPage from "./components/admin/AddExpert";
import AllServices from "./components/admin/AllServices";
import AddServicePage from "./components/admin/AddService";


function AppContent() {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';


  return (
    <div className = "min-h-screen flex flex-col">
      {!isAuthPage && (isAdminPage ? <AdminNav /> : <NavBar />)}
      <div className="flex-grow">
        {/* <NavBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicespage" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/expertspage" element={<ExpertPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Only render admin routes if the user is an admin */}
          {currentUser?.is_admin && (
          <Route path="/admin" element={<AdminDashboardSidebar />}>
            <Route path="dashboard" element={<AdminDasboardStats />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="allexperts" element={<AllExperts />} />
            <Route path="addexpert" element={<AddExpertPage />} />
            <Route path="allservices" element={<AllServices />} />
            <Route path="addservice" element={<AddServicePage />} />
          {/* <Route path="users" element={<UserList />} />
            <Route path="experts" element={<ExpertList />} />
            <Route path="services" element={<ServiceList />} /> */}


          </Route>
          )}
        </Routes>
      </div>

    </div>

  );
}

const App = () => {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
