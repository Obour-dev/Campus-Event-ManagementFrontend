import React, { useEffect, useState } from "react";
import '../styles/EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [preferences, setPreferences] = useState("");
  const [sortOrder, setSortOrder] = useState("upcoming"); // "upcoming" or "all"
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = preferences ? `?eventType=${preferences}` : "";
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        
        // Sort events by date
        const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [preferences]);

  const handleRSVP = async (eventId) => {
    try {
      if (!token) {
        setMessage("You must be signed in to RSVP.");
        return;
      }

      let userId;
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        userId = decodedToken.id;
      } catch {
        setMessage("Invalid token. Please sign in again.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to RSVP for the event.");
      }

      const updatedEvent = await response.json();
      console.log('Updated event from server:', updatedEvent);

      // Find the current event and update its capacity
      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event._id === eventId) {
            console.log('Updating event:', event._id, 'New capacity:', updatedEvent.capacity);
            return {
              ...event,
              capacity: updatedEvent.capacity || event.capacity - 1
            };
          }
          return event;
        })
      );

      setMessage("RSVP successful!");
    } catch (err) {
      console.error('RSVP error:', err);
      setMessage(err.message || "An error occurred.");
    }
  };

  const getFilteredEvents = () => {
    const currentDate = new Date();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (sortOrder === "upcoming") {
        return eventDate >= currentDate;
      }
      return true;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredEvents = getFilteredEvents();

  return (
    <div className="event-list-container">
      <h1 className="event-list-title">Upcoming Events</h1>
      {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="preferences">Event Type: </label>
          <select
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="club">Club Activity</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortOrder">Show: </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="all">All Events</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <h2 className="event-name">{event.name}</h2>
              <p className="event-date">{formatDate(event.date)}</p>
              <p className="event-location">
                <span className="label">Location:</span> {event.location}
              </p>
              <p className="event-type">
                <span className="label">Type:</span> {event.eventType}
              </p>
              <p className="event-details">
                <span className="label">Capacity:</span> {event.capacity}
              </p>
              {isAuthenticated ? (
                <button 
                  onClick={() => handleRSVP(event._id)}
                  className="rsvp-button"
                >
                  RSVP
                </button>
              ) : (
                <p className="signin-message">Sign in to RSVP</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;