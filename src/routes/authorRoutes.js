const router = require("express").Router();
const {
  listAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { isAdmin } = require("../middleware/auth");

// Public route
router.get("/", listAuthors);

// Admin-only writes
router.post("/", isAdmin, createAuthor);

// Get author by ID (public)
router.get("/:id", getAuthorById);

router.put("/:id", isAdmin, updateAuthor);

router.delete("/:id", isAdmin, deleteAuthor);

module.exports = router;
