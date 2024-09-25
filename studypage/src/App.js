import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/contexts/userContext';
import { UserContext } from "./components/contexts/userContext";
import { NavBar } from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Experts from './components/Experts';
import Services from './components/Services';
import Login from './components/forms/Login';
import SignUp from './components/forms/Signup';
import AdminPanel from './components/admin/AdminPanel';
import { UserList } from "./components/admin/users";
import { ExpertList } from "./components/admin/experts";
import { ServiceList } from "./components/admin/services";

function AppContent() {
  const { currentUser } = useContext(UserContext);
  
  return (
    <div className="flex-grow">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Only render admin routes if the user is an admin */}
        {currentUser?.is_admin && (
          <Route path="/admin/*" element={<AdminPanel />}>
            <Route path="users" element={<UserList />} />
            <Route path="experts" element={<ExpertList />} />
            <Route path="services" element={<ServiceList />} />


          </Route>
        )}
      </Routes>
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
