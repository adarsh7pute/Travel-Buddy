import React, { useEffect, useState, useCallback } from "react";
import { getTrips, deleteTrip } from "../api"; // Import deleteTrip
import { Link } from "react-router-dom"; // Import Link for navigation

export default function MyTripsPage({ token }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    if (!token) {
      setTrips([]);
      setLoading(false);
      setError("Please log in to view your trips.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedTrips = await getTrips(token);
      setTrips(fetchedTrips);
    } catch (e) {
      console.error("Failed to fetch trips for MyTripsPage:", e);
      setError(e.response?.data?.error || "Failed to load trips.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id, token);
        alert("Trip deleted successfully!");
        fetchTrips(); // Re-fetch trips after deletion
      } catch (e) {
        alert(e.response?.data?.error || e.message);
      }
    }
  }

  if (loading) {
    return (
      <div className="my-trips-page-container">
        <div className="loading-message">Loading your trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-trips-page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-trips-page-container">
      <h1 className="page-title">Your Travel Plans</h1>

      {trips.length === 0 ? (
        <div className="no-trips-message card">
          <p>You haven't created any travel plans yet.</p>
          <p>Start by generating a new itinerary!</p>
          <Link to="/" className="button primary-button">Plan a New Trip</Link>
        </div>
      ) : (
        <div className="trip-cards-grid">
          {trips.map(trip => (
            <div key={trip._id} className="trip-card-item card">
              <h3 className="trip-title">{trip.title || trip.destination}</h3>
              <p className="trip-dates">{trip.startDate} &rarr; {trip.endDate}</p>
              <div className="trip-actions">
                <Link to={`/trip/${trip._id}`} className="button secondary-button">View Details</Link>
                <button onClick={() => handleDelete(trip._id)} className="button delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
