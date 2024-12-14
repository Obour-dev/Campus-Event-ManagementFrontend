import React, { useEffect, useState } from "react";
import './UserProfile.css'; 

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState("");
  const [message, setMessage] = useState("");
  const [rsvps, setRsvps] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState("");
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      userId = decodedToken?.id;
    } catch {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    const fetchUserDetailsAndRSVPs = async () => {
      if (!userId) {
        console.error("No user ID found");
        return;
      }
      try {
        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`);

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const userData = await userResponse.json();
        setUser(userData);
        setPreferences(userData.preferences || "");
        setEditedPreferences(userData.preferences || "");

        const eventsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/user/${userId}`);

        if (!eventsResponse.ok) {
          throw new Error("Failed to fetch RSVP'd events.");
        }

        const eventsData = await eventsResponse.json();
        setRsvps(eventsData);
      } catch (error) {
        console.error("Error fetching user details and RSVP'd events:", error);
      }
    };

    if (userId) fetchUserDetailsAndRSVPs();
  }, [userId, token]);

  const handlePreferencesUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/preferences`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: editedPreferences }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setPreferences(editedPreferences);
      setIsEditing(false);
      setMessage("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      setMessage("Failed to update preferences.");
    }
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      {user ? (
        <>
          <div className="user-details">
            <div>
              <label>Name:</label>
              <p>{user.name}</p>
            </div>
            <div>
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div>
              <label>Preferences:</label>
              {isEditing ? (
                <div className="preferences-edit">
                  <select
                    value={editedPreferences}
                    onChange={(e) => setEditedPreferences(e.target.value)}
                    className="preferences-select"
                  >
                    <option value="">Select Preference</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="club">Club Activity</option>
                  </select>
                  <button onClick={handlePreferencesUpdate} className="save-button">
                    Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="preferences-display">
                  <p>{preferences}</p>
                  <button onClick={() => setIsEditing(true)} className="edit-button">
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {message && <p className="message">{message}</p>}

          <div className="rsvp-section">
            <h2>My RSVP'd Events</h2>
            {rsvps.length > 0 ? (
              <ul>
                {rsvps.map((event) => (
                  <li key={event._id}>
                    <h3>{event.name}</h3>
                    <p>Date: {new Date(event.date).toLocaleString()}</p>
                    <p>Location: {event.location}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No RSVP'd events.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
