const axios = require("axios");
const WKEY = process.env.OPENWEATHER_KEY || "";
async function getDailyForecast(lat, lng) {
  if (!WKEY) return [];
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,alerts&units=metric&appid=${WKEY}`;
    const { data } = await axios.get(url);
    return (data.daily || []).map(d => ({ date: new Date(d.dt*1000).toISOString().slice(0,10), temp:{min:d.temp.min,max:d.temp.max}, weather:d.weather?.[0]?.main||"", pop:d.pop||0 }));
  } catch (e) { console.warn("weather.getDailyForecast error", e.message); return []; }
}
module.exports = { getDailyForecast };
