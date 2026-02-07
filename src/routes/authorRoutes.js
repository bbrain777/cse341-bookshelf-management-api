const router = require("express").Router();
const {
  listAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor
} = require("../controllers/authorController");
const apiKeyAuth = require("../middleware/apiKeyAuth");

router.get("/", listAuthors);
router.post("/", apiKeyAuth, createAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", apiKeyAuth, updateAuthor);
router.delete("/:id", apiKeyAuth, deleteAuthor);

module.exports = router;
