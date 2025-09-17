import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteTrip } from "../api";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function TripPage(){
  const id = window.location.pathname.split("/").pop();
  const [trip,setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error messages
  const API_BASE = (import.meta.env.VITE_API_URL||'http://localhost:5000/api');
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(()=>{
    const fetchTripDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedTrip = null;

        // 1. Try authenticated access first if token exists
        if (token) {
          try {
            const res = await axios.get(`${API_BASE}/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchedTrip = res.data;
          } catch (authErr) {
            // If authenticated access fails, it might be a public trip not owned by user
            console.warn("Authenticated fetch failed, trying public endpoint:", authErr.message);
          }
        }

        // 2. If not fetched yet (either no token, or authenticated fetch failed), try public access
        if (!fetchedTrip) {
          try {
            const pubRes = await axios.get(`${API_BASE}/trips/public/${id}`);
            fetchedTrip = pubRes.data;
          } catch (pubErr) {
            console.error("Public fetch also failed:", pubErr.message);
            setError("Trip not found or you don't have permission to view it.");
            setLoading(false);
            return;
          }
        }

        if (fetchedTrip) {
          setTrip(fetchedTrip);
        } else {
          setError("Trip not found."); // Should ideally be caught by the public fetch error
        }

      } catch(e){
        console.error("Error fetching trip:", e);
        setError(e.response?.data?.error || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  },[id, token, API_BASE]); // Add API_BASE to dependency array

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(trip._id, token);
        alert("Trip deleted successfully!");
        window.location.href = "/my-trips"; // Redirect to my-trips page after deletion
      } catch (e) {
        alert(e.response?.data?.error || e.message);
      }
    }
  }

  function handleCopyLink() {
    const shareLink = window.location.origin + `/trip/${trip._id}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => alert("Share link copied to clipboard!"))
      .catch(err => console.error("Failed to copy link: ", err));
  }

  if (loading) return <div className="loading-message">Loading trip details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!trip) return <div className="error-message">Trip data not available.</div>; // Fallback if trip is null after loading

  const isOwner = currentUser && trip.userId === currentUser.id;

  return (
    <div className="trip-page-container card">
      <h1 className="trip-page-title">{trip.title || trip.destination}</h1>
      <div className="trip-page-dates">{trip.startDate} &rarr; {trip.endDate}</div>

      {trip.weatherCache && trip.weatherCache.length ? (
        <div className="weather-forecast-section">
          <strong>Weather Forecast</strong>
          <div className="weather-cards-container">
            {trip.weatherCache.slice(0,7).map((f,i)=>(
              <div key={i} className="weather-card">
                <div>{f.date}</div>
                <div className="small">{f.weather} &bull; {Math.round(f.temp?.min||0)}&ndash;{Math.round(f.temp?.max||0)}&deg;C</div>
                <div className="small">POP {Math.round((f.pop||0)*100)}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="itinerary-section">
        {trip.itinerary?.map(d=>(
          <div key={d.day} className="day-card">
            <strong>Day {d.day}</strong>
            <ul>{d.activities.map((a,i)=>(<li key={i}>{a}</li>))}</ul>
            {d.tip && <div className="small">Tip: {d.tip}</div>}
          </div>
        ))}
      </div>

      <div className="trip-page-actions">
        <a className="button secondary-button" href={`${API_BASE}/trips/${trip._id}/export`} target="_blank" rel="noreferrer">
          Export PDF
        </a>
        <button onClick={handleCopyLink} className="button secondary-button">Copy Share Link</button>
        {!isOwner && (
          <button onClick={handleDelete} className="button delete-button">
            Delete Trip
          </button>
        )}
      </div>
    </div>
  );
}
