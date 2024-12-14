import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import EventList from "./pages/EventList";
import AdminDashboard from "./pages/AdminDashboard";
import EventCalendar from "./pages/EventCalendar";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout";
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/events" element={<EventList />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/calendar" element={<EventCalendar />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
