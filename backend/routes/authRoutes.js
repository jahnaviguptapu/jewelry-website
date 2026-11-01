const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const adminOnly = require("../middleware/auth");

const router = express.Router();

const createToken = (user) =>
  jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// LOGIN (andariki)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: createToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: customer account create
router.post("/users", adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: "Name, email and password (6+ characters) required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "This email already has an account" });
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: customers list
router.get("/users", adminOnly, async (req, res) => {
  const users = await User.find({ isAdmin: false })
    .select("name email createdAt")
    .sort({ createdAt: -1 });
  res.json(users);
});

// Admin: customer delete
router.delete("/users/:id", adminOnly, async (req, res) => {
  await User.deleteOne({ _id: req.params.id, isAdmin: false });
  res.json({ message: "Deleted" });
});

module.exports = router;