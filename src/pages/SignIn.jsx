import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState("");
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("token");
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsLoggedIn(!!token);
    setIsAdmin(adminStatus);
  }, []);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMessage("Logged out successfully!");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp
      ? `${import.meta.env.VITE_BACKEND_URL}}/api/users/register`
      : `${import.meta.env.VITE_BACKEND_URL}/api/users/signin`;

    const userData = isSignUp
      ? { name, email, password, preferences }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(isSignUp ? "Registration successful!" : "Sign-in successful!");
        if (!isSignUp && data.token) {
          // Decode the JWT token to get admin status
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          console.log('Token payload:', tokenPayload);
          
          localStorage.setItem("token", data.token);
          localStorage.setItem("isAdmin", tokenPayload.isAdmin);
          setIsLoggedIn(true);
          
          if (tokenPayload.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/events");
          }
        }
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Server error. Please try again later.");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="sign-in-container">
        <h2>{window.location.pathname === "/admin" && !isAdmin ? "Access Denied" : "Welcome!"}</h2>
        <p className={`message ${window.location.pathname === "/admin" && !isAdmin ? "error" : "success"}`}>
          {window.location.pathname === "/admin" && !isAdmin 
            ? "You are not authorized to access the admin dashboard." 
            : "You are logged in."}
        </p>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="sign-in-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit} className="form">
        {isSignUp && (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isSignUp && (
          <div className="input-group">
            <label htmlFor="preferences">Preferences</label>
            <select
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select Preference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="club">Club Activity</option>
            </select>
          </div>
        )}

        <button type="submit" className="btn">
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {message && <p className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}

      <p onClick={toggleForm} className="toggle-form">
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default SignIn;
