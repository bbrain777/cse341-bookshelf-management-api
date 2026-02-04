const router = require("express").Router();
const bookRoutes = require("./bookRoutes");

router.get("/", (req, res) => {
  res.json({ message: "Bookshelf Management API" });
});

router.use("/books", bookRoutes);

module.exports = router;
