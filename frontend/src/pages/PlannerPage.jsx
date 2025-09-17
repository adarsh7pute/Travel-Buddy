import React, { useState } from "react";
import TripForm from "../components/TripForm";
import ItineraryView from "../components/ItineraryView";
export default function PlannerPage({ token ,refresh}){
  const [planResult, setPlanResult] = useState(null);
  return (<div><div className="card" style={{marginBottom:12}}><h2>Create a Trip</h2><TripForm  token={token}  refresh={refresh} onResult={(res)=>setPlanResult(res)} /></div>{planResult && <ItineraryView result={planResult} token={token} />}</div>);
}
