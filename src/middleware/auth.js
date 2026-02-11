// src/middleware/auth.js

// Check if user is logged in via OAuth session
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: true, message: "Unauthorized" });
}

// Check if user has admin role
function isAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res
      .status(403)
      .json({ error: true, message: "Forbidden: Admins only" });
  }
  return res.status(401).json({ error: true, message: "Unauthorized" });
}

module.exports = { isAuthenticated, isAdmin };
