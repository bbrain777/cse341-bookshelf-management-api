// src/controllers/authController.js

// Current user profile
function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: true, message: "Not authenticated" });
  }
  res.json({ data: req.user });
}

// Logout
function logout(req, res) {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
}

module.exports = { getProfile, logout };
