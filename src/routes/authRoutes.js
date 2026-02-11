// src/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const { getProfile, logout } = require("../controllers/authController");

const router = express.Router();
const oauthConfigured =
  !!process.env.GITHUB_CLIENT_ID &&
  !!process.env.GITHUB_CLIENT_SECRET &&
  !!process.env.GITHUB_CALLBACK_URL;

function oauthUnavailable(res) {
  return res.status(503).json({
    error: true,
    message: "GitHub OAuth is not configured on this server",
  });
}

// Start OAuth login
router.get("/login", (req, res, next) => {
  if (!oauthConfigured) {
    return oauthUnavailable(res);
  }
  return passport.authenticate("github")(req, res, next);
});

// OAuth callback
router.get("/callback", (req, res, next) => {
  if (!oauthConfigured) {
    return oauthUnavailable(res);
  }
  return passport.authenticate("github", { failureRedirect: "/api-docs" })(
    req,
    res,
    () => res.redirect("/api-docs"),
  );
});

// Current user profile
router.get("/me", getProfile);

// Logout
router.post("/logout", logout);

module.exports = router;
