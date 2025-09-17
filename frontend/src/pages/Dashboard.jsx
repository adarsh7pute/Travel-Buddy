import React, { useEffect } from "react"; // Removed useState as trips are passed via props
import { deleteTrip } from "../api";
import { Link } from "react-router-dom";

export default function Dashboard({ token, trips, refresh }){
  // The useEffect to call refresh() on mount is now handled by MyTripsPage
  // Dashboard just needs to call refresh when a trip is deleted.

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id, token);
        alert("Trip deleted successfully!");
        refresh(); // Refresh the list after deletion (this refresh comes from MyTripsPage)
      } catch (e) {
        alert(e.response?.data?.error || e.message);
      }
    }
  }

  return (
    <div>
      {/* MyTripsPage will handle the "no trips" message */}
      {trips.map(tr => (
        <div key={tr._id} className="dashboard-trip-item">
          <div>
            <strong>{tr.title || tr.destination}</strong>
            <div className="small">{tr.startDate} → {tr.endDate}</div>
            <Link to={`/trip/${tr._id}`} className="link">View Details</Link>
          </div>
          <button onClick={() => handleDelete(tr._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
