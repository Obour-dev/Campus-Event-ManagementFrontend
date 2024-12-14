import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/signin");
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/events" className="navbar-item">Events</Link>
          <Link to="/calendar" className="navbar-item">Calendar</Link>
          {token ? (
            <>
              <Link to="/profile" className="navbar-item">Profile</Link>
              {isAdmin && <Link to="/admin" className="navbar-item">Admin</Link>}
              <button onClick={handleSignOut} className="navbar-item sign-out">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="navbar-item">Sign In</Link>
          )}
        </nav>
      </header>
      <main className="body">{children}</main>
    </div>
  );
};

export default Layout;
