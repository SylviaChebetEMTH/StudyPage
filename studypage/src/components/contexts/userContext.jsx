// import { createContext, useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export const UserContext = createContext();

// // toast.configure();

// const fetchWithAuth = async (url, options = {}) => {
//   let token = localStorage.getItem("token");
//   options.headers = {
//     ...options.headers,
//     Authorization: `Bearer ${token}`,
//   };

//   let response = await fetch(url, options);

//   if (response.status === 401) {
//     const refreshToken = localStorage.getItem("refresh_token");
//     const refreshResponse = await fetch("https://studypage.onrender.com/refresh", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });

//     if (refreshResponse.ok) {
//       const refreshData = await refreshResponse.json();
//       localStorage.setItem("token", refreshData.access_token);
//       options.headers["Authorization"] = `Bearer ${refreshData.access_token}`;
//       response = await fetch(url, options);
//     } else {
//       localStorage.removeItem("token");
//       localStorage.removeItem("refresh_token");
//     }
//   }
//   return response;
// };

// export const useUserContext = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const nav = useNavigate();
//   const [authToken, setAuthToken] = useState(() => localStorage.getItem("token") || null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchCurrentUser = async () => {
//     if (authToken) {
//       try {
//         const response = await fetchWithAuth("https://studypage.onrender.com/current_user", {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setCurrentUser(data);
//           nav(data.is_admin ? "/admin/dashboard" : "/");
//         } else {
//           toast.error(data.message || "Please sign in");
//           handleLogout();
//         }
//       } catch (error) {
//         toast.error("Please sign in");
//         handleLogout();
//       }
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchCurrentUser();
//   }, [authToken]);

//   const signup = (username, email, phone_number = "", password) => {
//     fetch("https://studypage.onrender.com/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, phone_number, password }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.success) {
//           toast.success(res.success);
//           nav("/login");
//         } else {
//           toast.error(res.message || "Something went wrong");
//         }
//       })
//       // .catch(() => toast.error("Something went wrong"));
//   };
//   const login = async (email, password) => {
//     setLoading(true); // Start loading
  
//     try {
//       const response = await fetch("https://studypage.onrender.com/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
  
//       const res = await response.json();
  
//       if (response.ok && res.access_token) {
//         setAuthToken(res.access_token);
//         localStorage.setItem("token", res.access_token);
//         localStorage.setItem("refresh_token", res.refresh_token);
//         toast.success("Login successful");
//         // nav("/");
//       } else {
//         toast.error(res.message || "Invalid credentials");
//       }
//     } catch (error) {
//       console.error("Login request failed:", error);
//       toast.error("Network error. Please try again.");
//     } finally {
//       setLoading(false); // Stop loading in all cases
//     }
//   };
  
//   // const login = (email, password) => {
//   //   // setLoading(true);
//   //   fetch("https://studypage.onrender.com/login", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ email, password }),
//   //   })
//   //     .then((res) => res.json())
//   //     .then((res) => {
//   //       if (res.access_token) {
//   //         setAuthToken(res.access_token);
//   //         localStorage.setItem("token", res.access_token);
//   //         localStorage.setItem("refresh_token", res.refresh_token);
//   //         toast.success("Login successful");
//   //         nav("/");
//   //       } else {
//   //         toast.error(res.message || "Invalid credentials");
//   //       }
//   //     })
//   //     // setLoading(false)
//   //     // .catch(() => toast.error("Something went wrong"));
//   // };

//   const handleLogout = () => {
//     setAuthToken(null);
//     setCurrentUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("refresh_token");
//     nav("/login");
//   };

//   const logout = () => {
//     handleLogout(); // Clear tokens & state
//     window.location.href = "/login"; // Hard refresh ensures fresh login state
//   };

  

//   const contextData = {
//     currentUser,
//     setCurrentUser,
//     setAuthToken,
//     signup,
//     login,
//     logout,
//     authToken,
//     loading,
//   };

//   return <UserContext.Provider value={contextData}>{children}</UserContext.Provider>;
// };



import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserContext = createContext();

const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    const refreshResponse = await fetch("https://studypage-76hu.onrender.com/refresh", {
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
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchCurrentUser = async (shouldNavigate = false) => {
    if (authToken) {
      try {
        setLoading(true);
        const response = await fetchWithAuth("https://studypage-76hu.onrender.com/current_user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        
        if (response.ok) {
          setCurrentUser(data);
          // Only navigate if specifically requested
          if (shouldNavigate) {
            nav(data.is_admin ? "/admin/dashboard" : "/");
          }
        } else {
          toast.error(data.message || "Please sign in");
          handleLogout();
        }
      } catch (error) {
        toast.error("Please sign in");
        handleLogout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Effect for initial authentication check - doesn't navigate
  useEffect(() => {
    if (isInitialLoad && authToken) {
      fetchCurrentUser(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Effect for token changes after initial load
  useEffect(() => {
    if (!isInitialLoad && authToken) {
      fetchCurrentUser(true);
    }
  }, [authToken, isInitialLoad]);

  const signup = async (username, email, phone_number = "", password) => {
    setLoading(true);
    try {
      const registerResponse = await fetch("https://studypage-76hu.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phone_number, password }),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok && registerData.success) {
        toast.success(registerData.success || "User registered successfully");
        
        // Automatically log in the user after successful signup
        try {
          const loginResponse = await fetch("https://studypage-76hu.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.access_token) {
            // Store tokens
            localStorage.setItem("token", loginData.access_token);
            localStorage.setItem("refresh_token", loginData.refresh_token);

            // Fetch user data
            const userResponse = await fetch("https://studypage-76hu.onrender.com/current_user", {
              method: "GET",
              headers: { 
                "Authorization": `Bearer ${loginData.access_token}`
              },
            });

            const userData = await userResponse.json();

            if (userResponse.ok) {
              setCurrentUser(userData);
              setAuthToken(loginData.access_token);
              
              // Return user data so component can handle navigation
              return { success: true, user: userData };
            } else {
              // Log the actual error for debugging
              console.error("Error fetching user data:", userData);
              const errorMessage = userData?.msg || userData?.message || userData?.error || "Error fetching user data";
              toast.error(errorMessage);
              return { success: false, error: errorMessage };
            }
          } else {
            const errorMessage = loginData.message || "Auto-login failed. Please log in manually.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          const errorMessage = "Registration successful, but auto-login failed. Please log in manually.";
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } else {
        const errorMessage = registerData.error || registerData.message || "Something went wrong";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = "Network error. Please check your connection and try again.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
  
    try {
      const response = await fetch("https://studypage-76hu.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const res = await response.json();
  
      if (response.ok && res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
        
        // Fetch user data
        const userResponse = await fetch("https://studypage-76hu.onrender.com/current_user", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${res.access_token}`
          },
        });
        
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          setCurrentUser(userData);
          setAuthToken(res.access_token);
          
          // Return user data so component can handle navigation
          return { success: true, user: userData };
        } else {
          // Log the actual error for debugging
          console.error("Error fetching user data:", userData);
          const errorMessage = userData?.msg || userData?.message || userData?.error || "Error fetching user data";
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } else {
        // Return error so component can handle it
        const errorMessage = res.message || "Invalid email or password";
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Login request failed:", error);
      const errorMessage = "Network error. Please check your connection and try again.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    nav("/login");
  };

  const logout = () => {
    handleLogout();
    window.location.href = "/login";
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