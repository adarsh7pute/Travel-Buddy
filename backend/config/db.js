const mongoose = require("mongoose");
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.warn("⚠️  MONGO_URI not set. DB features disabled."); return; }
  try { await mongoose.connect(uri); console.log("✅ MongoDB connected"); } catch (err) { console.error("MongoDB connection error:", err.message); }
}
module.exports = connectDB;
