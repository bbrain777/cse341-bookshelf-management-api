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
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: true, message: "Logout failed" });
    }

    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
}

module.exports = { getProfile, logout };
