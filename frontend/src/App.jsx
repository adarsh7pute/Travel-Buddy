import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import Dashboard from "./components/Dashboard"; // REMOVE THIS IMPORT
import TripPage from "./pages/TripPage";
import MyTripsPage from "./pages/MyTripsPage";
import NavBar from "./components/NavBar";
// No longer need getTrips import here as MyTripsPage handles its own fetching

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const navigate = useNavigate();

  // This refresh function is now only for the PlannerPage if it needs to trigger something
  // after a trip is created, but it won't refresh the trip list directly.
  const refreshPlannerPage = useCallback(() => {
    console.log("Planner page refresh triggered (if needed)");
  }, []);

  function handleLogin(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    navigate("/");
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="app-container">
      <NavBar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          {/* Public routes (accessible when not logged in) */}
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/" replace /> : <SignupPage onSignup={handleLogin} />}
          />

          {/* Protected routes (accessible only when logged in) */}
          {token ? (
            <>
              <Route
                path="/"
                element={
                  <div className="dashboard-layout">
                    <div className="planner-section">
                      <PlannerPage token={token} refresh={refreshPlannerPage} />
                    </div>
                    <aside className="sidebar-section">
                      {/* The "Your Trips" card is removed from here */}
                      <div className="card notes-card">
                        <h3 className="small">Notes</h3>
                        <p className="small">Add destination, dates and interests to generate a plan. Use Export to download PDF.</p>
                      </div>
                    </aside>
                  </div>
                }
              />
              <Route path="/my-trips" element={<MyTripsPage token={token} />} /> {/* Route for the new page */}
              <Route path="/trip/:id" element={<TripPage />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </div>
  );
}
