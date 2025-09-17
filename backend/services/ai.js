let genAI = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  if (process.env.GEMINI_API_KEY) genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (e) {}
function naiveItinerary(destination, startDate, endDate, interests, budget) {
  const start = new Date(startDate); const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start)/(1000*60*60*24))+1);
  const base = interests.length ? interests : ["sightseeing","local food","walk"];
  const perDay = budget === "packed" ? 5 : budget === "chill" ? 2 : 3;
  const itinerary = [];
  for (let i=0;i<days;i++){
    const acts=[]; for(let j=0;j<perDay;j++) acts.push(`Enjoy ${base[j%base.length]} in ${destination}`);
    itinerary.push({ day: i+1, activities: acts, tip: "Carry water; keep some cash." });
  }
  return itinerary;
}
async function aiItinerary(destination, startDate, endDate, interests=[], budget="medium",language){
  // console.log(language);
  if (!genAI) return naiveItinerary(destination,startDate,endDate,interests,budget);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `You are a concise travel planner. Destination: ${destination}. Dates: ${startDate} to ${endDate}. Interests: ${interests.join(", ") || "general"}. Budget: ${budget}.
Return JSON ONLY in this exact format:
{ "itinerary": [ { "day": 1, "activities": ["...","..."], "tip": "..." } ] } you can get also get real time wheather data on that day and add it on tip if not clear on each day all data.All data in ${language}`;
  try {
    const resp = await model.generateContent(prompt);
    const text = resp.response.text();
    const cleanedString = text
    .replace(/^```json\n/, '')
    .replace(/\n```$/, '');

    const json = JSON.parse(cleanedString);
    if (Array.isArray(json.itinerary)) return json.itinerary;
    return naiveItinerary(destination,startDate,endDate,interests,budget);
  } catch (e) { console.warn("aiItinerary failed", e.message); return naiveItinerary(destination,startDate,endDate,interests,budget); }
}
module.exports = { aiItinerary };
