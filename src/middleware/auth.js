function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: true, message: "Unauthorized" });
}

function isAdmin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ error: true, message: "Forbidden: Admins only" });
}

function isOwnerOrAdmin(ownerField = "ownerUserId") {
  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    if (req.user && req.user.role === "admin") {
      return next();
    }

    const ownerId = req.resource && req.resource[ownerField];
    if (ownerId && String(ownerId) === String(req.user && req.user._id)) {
      return next();
    }

    return res.status(403).json({ error: true, message: "Forbidden" });
  };
}

module.exports = { isAuthenticated, isAdmin, isOwnerOrAdmin };
