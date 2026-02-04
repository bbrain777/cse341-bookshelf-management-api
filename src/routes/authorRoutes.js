const router = require("express").Router();
const {
  listAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor
} = require("../controllers/authorController");

router.get("/", listAuthors);
router.post("/", createAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
