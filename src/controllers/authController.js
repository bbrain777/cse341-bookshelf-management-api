// src/controllers/authController.js
exports.getProfile = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({
      success: true,
      user: req.user,
    });
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out" });
  });
};
