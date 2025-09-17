    import React, { useState } from "react";
    import { createPlan } from "../api";

    export default function TripForm({ token, refresh, onResult }){
      const [destination,setDestination]=useState("");
      const [startDate,setStartDate]=useState("");
      const [endDate,setEndDate]=useState("");
      const [interests,setInterests]=useState("");
      const [language,setLanguage]=useState("");
      const [budget,setBudget]=useState("medium");
      const [title,setTitle]=useState("");
      const [loading,setLoading]=useState(false);

      async function submit(e){
        e.preventDefault();
        try{
          setLoading(true);
          const data = await createPlan({ destination, startDate, endDate, interests: interests.split(",").map(s=>s.trim()).filter(Boolean), budget, title,language }, token);
          onResult && onResult(data);
          refresh();
          alert("Trip created!");
        }catch(e){
          alert(e.response?.data?.error||e.message );
        }finally{
          setLoading(false);
        }
      }

      return (
        <form onSubmit={submit} style={{display:"grid", gap:15}}> {/* Increased gap */}
          <div>
            <label htmlFor="title">Trip Title (Optional)</label>
            <input id="title" placeholder="e.g., Summer Adventure in Europe" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="destination">Destination</label>
            <input id="destination" placeholder="e.g., Goa, India" value={destination} onChange={e=>setDestination(e.target.value)} required />
          </div>
          <div style={{display:"flex", gap:15}}> {/* Increased gap */}
            <div style={{flex: 1}}>
              <label htmlFor="startDate">Start Date</label>
              <input id="startDate" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
            </div>
            <div style={{flex: 1}}>
              <label htmlFor="endDate">End Date</label>
              <input id="endDate" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="interests">Interests (Comma Separated)</label>
            <input id="interests" placeholder="e.g., beaches, history, food" value={interests} onChange={e=>setInterests(e.target.value)} />
          </div>
          <div>
            <label htmlFor="language">Language</label>
            <input id="language" placeholder="e.g., english, hindi, marathi" value={language} onChange={e=>setLanguage(e.target.value)} />
          </div>
          <div>
            <label htmlFor="budget">Budget Style</label>
            <select id="budget" value={budget} onChange={e=>setBudget(e.target.value)}>
              <option value="chill">Chill (Relaxed pace)</option>
              <option value="medium">Balanced (Mix of activities)</option>
              <option value="packed">Packed (Lots of activities)</option>
            </select>
          </div>
          <button type="submit" style={{backgroundColor:"#2563eb",color:"white"}} disabled={loading}>
            {loading ? "Planning..." : "Generate Plan"}
          </button>
        </form>
      );
    }
    