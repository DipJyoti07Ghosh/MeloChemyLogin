const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/role");

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- SIGNIN ----------------
router.post("/signin", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.role !== role)
      return res.status(403).json({ message: "Role mismatch" });

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------------- PROTECTED ROUTE (User) ----------------
router.get("/user-dashboard", auth, roleAuth(["user"]), (req, res) => {
  res.json({ message: "Welcome to User Dashboard" });
});

// ---------------- PROTECTED ROUTE (Admin) ----------------
router.get("/admin-dashboard", auth, roleAuth(["admin"]), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router;