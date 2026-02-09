const express = require("express");
const authorRoutes = require("./authorRoutes");
const bookRoutes = require("./bookRoutes");
const memberRoutes = require("./memberRoutes");
const loanRoutes = require("./loanRoutes");

const router = express.Router();

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/members", memberRoutes);
router.use("/loans", loanRoutes);

module.exports = router;
