const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name||!email||!password) return res.status(400).json({ error: "name,email,password required" });
    const existing = await User.findOne({ email }); if (existing) return res.status(400).json({ error: "Email already used" });
    const salt = await bcrypt.genSalt(10); const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET||"devsecret", { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; if (!email||!password) return res.status(400).json({ error: "email,password required" });
    const user = await User.findOne({ email }); if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash); if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET||"devsecret", { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
