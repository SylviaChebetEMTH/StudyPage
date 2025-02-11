import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserContext = createContext();

// toast.configure();

const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    const refreshResponse = await fetch("https://studypage.onrender.com/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem("token", refreshData.access_token);
      options.headers["Authorization"] = `Bearer ${refreshData.access_token}`;
      response = await fetch(url, options);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }
  return response;
};

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const nav = useNavigate();
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    if (authToken) {
      try {
        const response = await fetchWithAuth("https://studypage.onrender.com/current_user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentUser(data);
          nav(data.is_admin ? "/admin/dashboard" : "/");
        } else {
          toast.error(data.message || "Failed to fetch current user");
          handleLogout();
        }
      } catch (error) {
        toast.error("Error fetching current user");
        handleLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [authToken]);

  const signup = (username, email, phone_number = "", password) => {
    fetch("https://studypage.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, phone_number, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.success);
          nav("/login");
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })
      // .catch(() => toast.error("Something went wrong"));
  };

  const login = (email, password) => {
    fetch("https://studypage.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.access_token) {
          setAuthToken(res.access_token);
          localStorage.setItem("token", res.access_token);
          localStorage.setItem("refresh_token", res.refresh_token);
          toast.success("Login successful");
          nav("/");
        } else {
          toast.error(res.message || "Invalid credentials");
        }
      })
      // .catch(() => toast.error("Something went wrong"));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    nav("/login");
  };

  const logout = () => {
    fetchWithAuth("https://studypage.onrender.com/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success("Logged out successfully");
          nav("/login")
          handleLogout();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const contextData = {
    currentUser,
    setCurrentUser,
    setAuthToken,
    signup,
    login,
    logout,
    authToken,
    loading,
  };

  return <UserContext.Provider value={contextData}>{children}</UserContext.Provider>;
};
