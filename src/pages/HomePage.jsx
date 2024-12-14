import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <img 
          src="/images/campus-events-logo.png" 
          alt="Campus Events Logo" 
          className="hero-image"
        />
        <h1 className="hero-title">Campus Events</h1>
        <p className="hero-subtitle">Your One-Stop Platform for Campus Activities</p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2>Browse Events</h2>
          <p>Discover workshops, seminars, and club activities</p>
          <Link to="/events" className="feature-link">View Events</Link>
        </div>

        <div className="feature-card">
          <h2>Event Calendar</h2>
          <p>Plan your schedule with our interactive calendar</p>
          <Link to="/calendar" className="feature-link">Open Calendar</Link>
        </div>

        <div className="feature-card">
          <h2>Your Profile</h2>
          <p>Manage your RSVPs and preferences</p>
          <Link to="/profile" className="feature-link">Go to Profile</Link>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Join?</h2>
        <p>Sign up now to start participating in campus events!</p>
        <Link to="/signin" className="cta-button">Get Started</Link>
      </div>
    </div>
  );
};

export default HomePage; 