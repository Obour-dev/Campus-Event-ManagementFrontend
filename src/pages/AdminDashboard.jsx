import "./../styles/AdminDashboard.css";
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    capacity: "",
    eventType: "",
  });
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
      if (!response.ok) {
        throw new Error("Failed to fetch events.");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setMessage("Failed to load events.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event.");
      }

      const data = await response.json();
      setMessage(data.message || "Event created successfully!");
      setFormData({ name: "", date: "", location: "", capacity: "", eventType: "" });
      fetchEvents();
    } catch (err) {
      setMessage(err.message || "An error occurred.");
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_UR}/api/events/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      // First check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        if (!response.ok) {
          throw new Error(errorData.message || "Failed to delete event.");
        }
      } else if (!response.ok) {
        throw new Error("Server error: Failed to delete event");
      }

      // If we get here, the delete was successful
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      setMessage("Event deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.message || "Failed to delete event.");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your events and users</p>
      </div>

      {message && <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}

      <div className="admin-form">
        <h2 className="form-title">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Select Event Type</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="club">Club Activity</option>
            </select>
          </div>
          <button type="submit" className="admin-button">
            Create Event
          </button>
        </form>
      </div>

      {events.length > 0 ? (
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{new Date(event.date).toLocaleString()}</td>
                <td>{event.location}</td>
                <td>{event.capacity}</td>
                <td>{event.eventType}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="admin-button delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="message">No events found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
