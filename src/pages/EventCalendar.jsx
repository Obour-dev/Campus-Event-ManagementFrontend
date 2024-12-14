import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/EventCalendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = preferences ? `?eventType=${preferences}` : "";
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        // Format events for the calendar
        const formattedEvents = data.map((event) => ({
          title: event.name,
          start: new Date(event.date),
          end: new Date(event.date),
          location: event.location,
          eventType: event.eventType,
          capacity: event.capacity
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [preferences]);

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Event Calendar</h1>
      
      <div className="calendar-filters">
        <label htmlFor="preferences">Filter by Event Type: </label>
        <select
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="calendar-select"
        >
          <option value="">All Events</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="club">Club Activity</option>
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh", margin: "20px 0" }}
        views={["month", "week", "day"]}
        eventPropGetter={(event) => ({
          className: `event-${event.eventType}`,
          style: {
            backgroundColor: "#3182ce",
            color: "white",
            borderRadius: "4px",
            border: "none"
          }
        })}
        tooltipAccessor={(event) => `
          ${event.title}
          Location: ${event.location}
          Type: ${event.eventType}
          Capacity: ${event.capacity}
        `}
      />
    </div>
  );
};

export default EventCalendar;
