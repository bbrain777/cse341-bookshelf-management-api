module.exports = function apiKeyAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized. Use Authorization: Bearer <token>."
    });
  }

  if (!process.env.API_KEY || token !== process.env.API_KEY) {
    return res.status(401).json({ error: true, message: "Invalid token." });
  }

  return next();
};
