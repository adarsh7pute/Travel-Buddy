import axios from "axios";
const API = "https://travel-buddy-c87w.onrender.com" || import.meta.env.VITE_API_URL || "http://localhost:5000/api" ;

export async function signup(data){ const res = await axios.post(`${API}/auth/signup`, data); return res.data; }
export async function login(data){ const res = await axios.post(`${API}/auth/login`, data); return res.data; }
export async function createPlan(data, token){ const res = await axios.post(`${API}/planner`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}); return res.data; }
export async function getTrips(token){ const res = await axios.get(`${API}/trips`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}); return res.data; }
export async function getTripById(id){ const res = await axios.get((import.meta.env.VITE_API_URL||'http://localhost:5000/api') + '/trips/' + id); return res.data; }
export async function exportTrip(id){ const url = (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + `/trips/${id}/export`; return url; }
export async function deleteTrip(id, token){ // New function for deleting a trip
  const res = await axios.delete(`${API}/trips/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return res.data;
}
