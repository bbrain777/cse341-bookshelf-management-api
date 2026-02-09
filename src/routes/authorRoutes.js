const router = require("express").Router();
const {
  listAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

const apiKeyAuth = require("../middleware/apiKeyAuth");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public route
router.get("/", listAuthors);

// Create author: must be logged in via OAuth
router.post("/", isAuthenticated, createAuthor);

// Get author by ID (public)
router.get("/:id", getAuthorById);

// Update author: protect with API key OR OAuth
router.put("/:id", apiKeyAuth, updateAuthor);

// Delete author: admin-only via OAuth
router.delete("/:id", isAdmin, deleteAuthor);

module.exports = router;
