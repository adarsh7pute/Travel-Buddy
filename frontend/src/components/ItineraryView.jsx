    import React from "react";
    import { exportTrip } from "../api";

    function DayCard({ d }) {
      return (
        <div className="day-card"> {/* Apply new class */}
          <strong>Day {d.day}</strong>
          <ul>
            {d.activities.map((a,i)=>(<li key={i}>{a}</li>))}
          </ul>
          {d.tip && <div className="small">Tip: {d.tip}</div>}
        </div>
      );
    }

    export default function ItineraryView({ result, token}) {
      if (!result) return null;
      const trip = result.trip || result;
      const forecast = result.forecast || trip.weatherCache || null; // Simplified access

      function handleCopyLink() {
        const shareLink = window.location.origin + `/trip/${trip._id}`;
        navigator.clipboard.writeText(shareLink)
          .then(() => alert("Share link copied to clipboard!"))
          .catch(err => console.error("Failed to copy link: ", err));
      }

      return (
        <div className="card">
          <div className="itinerary-view-header"> {/* New header section */}
            <h2>{trip.title || trip.destination}</h2>
            <div className="small">{trip.startDate} → {trip.endDate}</div>
          </div>

          {forecast && forecast.length ? (
            <div className="weather-forecast-section"> {/* Apply new class */}
              <strong>Weather forecast</strong>
              <div className="weather-cards-container"> {/* Apply new class */}
                {forecast.slice(0,7).map((f,i)=>(
                  <div key={i} className="weather-card"> {/* Apply new class */}
                    <div>{f.date}</div>
                    <div className="small">{f.weather} • {Math.round(f.temp?.min||0)}–{Math.round(f.temp?.max||0)}°C</div>
                    <div className="small">POP {Math.round((f.pop||0)*100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{marginTop:20}}> {/* Adjusted margin */}
            {trip.itinerary?.map(d=> <DayCard key={d.day} d={d} />)}
          </div>

          <div className="itinerary-actions"> {/* Apply new class */}
            <a className="link" href={(import.meta.env.VITE_API_URL||'http://localhost:5000/api') + '/trips/' + trip._id + '/export'} target="_blank" rel="noreferrer">
                <button  style={{backgroundColor:"#2563eb",color:"white"}}>Export PDF</button>
              </a>
            <button style={{backgroundColor:"#2563eb",color:"white"}} onClick={handleCopyLink}>Copy Share Link</button>
          </div>
        </div>
      );
    }
    