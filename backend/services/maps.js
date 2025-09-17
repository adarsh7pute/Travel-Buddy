const axios = require("axios");
const GKEY = process.env.GOOGLE_MAPS_KEY || "";
async function geocodeCity(city) {
  if (!GKEY) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${GKEY}`;
    const { data } = await axios.get(url);
    if (!data.results?.length) return null;
    const r = data.results[0];
    return { name: r.name, lat: r.geometry.location.lat, lng: r.geometry.location.lng, placeId: r.place_id };
  } catch (e) { console.warn("maps.geocodeCity error", e.message); return null; }
}
module.exports = { geocodeCity };
