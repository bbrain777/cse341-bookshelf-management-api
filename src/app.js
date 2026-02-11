const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./passport");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const shelfRoutes = require("./routes/shelfRoutes");
const memberRoutes = require("./routes/memberRoutes");
const loanRoutes = require("./routes/loanRoutes");
const { swaggerSetup } = require("./swagger/swagger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res
    .status(200)
    .type("text/plain")
    .send("Bookshelf API is running. Visit /health or /api-docs.");
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/shelves", shelfRoutes);
app.use("/members", memberRoutes);
app.use("/loans", loanRoutes);

swaggerSetup(app);
app.use(errorHandler);

module.exports = app;
