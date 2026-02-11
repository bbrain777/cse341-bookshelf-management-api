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
  return passport.authenticate("github", (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, message: "OAuth error", details: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: true, message: "OAuth failed" });
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({
          error: true,
          message: "Session login failed",
          details: loginErr.message,
        });
      }
      return res.redirect("/api-docs");
    });
  })(req, res, next);
});

// Current user profile
router.get("/me", getProfile);

// Logout
router.post("/logout", logout);

module.exports = router;
