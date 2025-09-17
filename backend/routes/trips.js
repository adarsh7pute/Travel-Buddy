const express = require("express");
const Trip = require("../models/Trip");
const pdf = require("html-pdf");
const router = express.Router();
router.post("/", async (req, res) => { try { const trip = await Trip.create(req.body); res.json(trip); } catch (e) { res.status(400).json({ error: e.message }); } });
router.get("/", async (req, res) => { const trips = await Trip.find().sort({ createdAt: -1 }); res.json(trips); });
router.get("/:id", async (req, res) => { const t = await Trip.findById(req.params.id); if (!t) return res.status(404).json({ error: "Not found" }); res.json(t); });
router.put("/:id", async (req, res) => { const t = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(t); });
router.delete("/:id", async (req, res) => { await Trip.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
router.get("/public/:id", async (req, res) => { const t = await Trip.findById(req.params.id); if (!t || !t.public) return res.status(404).json({ error: "Not found or not public" }); res.json(t); });
router.get("/:id/export", async (req, res) => {
  try {
    const t = await Trip.findById(req.params.id); if (!t) return res.status(404).json({ error: "Not found" });
    const html = `<html><body><h1>${t.title || t.destination}</h1><h3>${t.startDate} -> ${t.endDate}</h3>${t.itinerary.map(d=>'<h4>Day '+d.day+'</h4><ul>'+d.activities.map(a=>'<li>'+a+'</li>').join('')+'</ul>').join('')}</body></html>`;
    pdf.create(html).toBuffer((err, buffer) => { if (err) return res.status(500).json({ error: err.message }); res.setHeader("Content-Type", "application/pdf"); res.setHeader("Content-Disposition", `attachment; filename="trip_${t._id}.pdf"`); res.send(buffer); });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
