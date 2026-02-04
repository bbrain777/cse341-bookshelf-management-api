const router = require("express").Router();
const bookRoutes = require("./bookRoutes");
const authorRoutes = require("./authorRoutes");

router.get("/", (req, res) => {
  res.json({ message: "Bookshelf Management API" });
});

router.use("/books", bookRoutes);
router.use("/authors", authorRoutes);

module.exports = router;
