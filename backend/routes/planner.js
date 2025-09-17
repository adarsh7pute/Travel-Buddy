const express = require("express");
const { aiItinerary } = require("../services/ai");
const { geocodeCity } = require("../services/maps");
const { getDailyForecast } = require("../services/weather");
const Trip = require("../models/Trip");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
    const { destination, startDate, endDate, interests = [], budget="medium", title="", makePublic=false, userId,language } = req.body;
    if (!destination || !startDate || !endDate) return res.status(400).json({ error: "destination,startDate,endDate required" });
    const geo = await geocodeCity(destination);
    const itinerary = await aiItinerary(destination, startDate, endDate, interests, budget,language);
    const forecast = geo ? await getDailyForecast(geo.lat, geo.lng) : [];
    const trip = await Trip.create({ userId, title, destination, startDate, endDate, interests, budget, itinerary, public: !!makePublic, weatherCache: forecast });
    res.json({ trip, forecast });
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});
module.exports = router;
