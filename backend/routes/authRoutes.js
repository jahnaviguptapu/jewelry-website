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

const sendUser = (res, user, status = 200) =>
  res.status(status).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: createToken(user),
  });

// REGISTER (customer tanu account create chesukuntadu)
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "This email already has an account. Please log in." });
    }

    // isAdmin ippudu eppudu false (customer ela admin avvalenu)
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      isAdmin: false,
    });
    sendUser(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN (customer and admin)
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });
    sendUser(res, user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: customers list
router.get("/users", adminOnly, async (req, res) => {
  const users = await User.find({ isAdmin: false })
    .select("name email createdAt")
    .sort({ createdAt: -1 });
  res.json(users);
});

// Admin: customer account delete
router.delete("/users/:id", adminOnly, async (req, res) => {
  await User.deleteOne({ _id: req.params.id, isAdmin: false });
  res.json({ message: "Deleted" });
});

module.exports = router;