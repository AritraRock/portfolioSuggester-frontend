import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import {jwtDecode} from "jwt-decode"; // Correctly import jwt-decode

// Create the AuthContext
const AuthContext = createContext(null);

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // State to manage tokens and user data
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (storedTokens) {
      try {
        const decoded = jwtDecode(JSON.parse(storedTokens).access);
        return decoded;
      } catch (error) {
        console.error("Invalid token, clearing authTokens:", error);
        localStorage.removeItem("authTokens");
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  // Login function
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.status === 200 && data.access) {
        const decodedUser = jwtDecode(data.access); // Decode token here
        setAuthTokens(data);
        setUser(decodedUser);
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/"); // Navigate to home
        setAlert({ message: "Login Successful", severity: "success" });
      } else {
        setAlert({ message: "Username or password does not exist", severity: "error" });
      }
    } catch (error) {
      setAlert({ message: "An error occurred", severity: "error" });
      console.error("Login Error:", error);
    }
  };

  // Registration function
  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          password2,
        }),
      });
      if (response.status === 201) {
        setAlert({ message: "Registration Successful, Login Now", severity: "success" });
        navigate("/login");
      } else {
        setAlert({ message: "An Error Occurred", severity: "error" });
      }
    } catch (error) {
      setAlert({ message: "An Error Occurred", severity: "error" });
      console.error("Registration Error:", error);
    }
  };

  // Logout function
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    setAlert({ message: "You have been logged out", severity: "success" });
  };

  // Effect to set user data if tokens are present
  useEffect(() => {
    if (authTokens) {
      try {
        const decodedUser = jwtDecode(authTokens.access); // Decode token safely
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token, clearing authTokens:", error);
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login"); // Redirect to login if token is invalid
      }
    }
    setLoading(false);
  }, [authTokens, navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, authTokens, setAuthTokens, registerUser, loginUser, logoutUser }}>
      {loading ? null : children}

      {/* Snackbar for alerts */}
      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={alert.severity === 'error' ? 5000 : 3000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      )}
    </AuthContext.Provider>
  );
};
