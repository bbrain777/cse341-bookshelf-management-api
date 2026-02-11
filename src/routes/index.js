const express = require("express");
const authorRoutes = require("./authorRoutes");
const bookRoutes = require("./bookRoutes");
const shelfRoutes = require("./shelfRoutes");
const memberRoutes = require("./memberRoutes");
const loanRoutes = require("./loanRoutes");

const router = express.Router();

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/shelves", shelfRoutes);
router.use("/members", memberRoutes);
router.use("/loans", loanRoutes);

module.exports = router;
