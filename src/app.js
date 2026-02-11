// src/app.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./passport");

const routes = require("./routes"); // index.js gathers feature routes
const authRoutes = require("./routes/authRoutes");
const { swaggerSetup } = require("./swagger/swagger");
const errorHandler = require("./middleware/errorHandler");
const { isAuthenticated, isAdmin } = require("./middleware/auth"); // 🔑 import middleware
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");
const app = express();

// Middleware
app.use(
  cors({
    origin: "https://<your-render-app>.onrender.com", // replace with your Render app URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // ✅ works on Render HTTPS
      sameSite: "none", // ✅ allows Swagger to send cookies
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Public routes
app.use("/auth", authRoutes);

// Protected routes (admin only)
app.use("/books", isAdmin, bookRoutes);
app.use("/authors", isAdmin, authorRoutes);
app.use("/members", isAdmin, memberRoutes);
app.use("/loans", isAdmin, loanRoutes);

// Swagger
swaggerSetup(app, {
  swaggerOptions: { withCredentials: true },
});

// Error handler
app.use(errorHandler);

module.exports = app;
