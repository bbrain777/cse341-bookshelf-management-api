// src/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const { getProfile, logout } = require("../controllers/authController");

const router = express.Router();

// Start OAuth login
router.get("/login", passport.authenticate("github"));

// OAuth callback
router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    res.redirect("/api-docs"); // redirect to Swagger after login
  },
);

// Current user profile
router.get("/me", getProfile);

// Logout
router.post("/logout", logout);

module.exports = router;
