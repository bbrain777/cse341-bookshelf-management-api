const router = require("express").Router();
const {
  listBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const apiKeyAuth = require("../middleware/apiKeyAuth");

router.get("/", listBooks);
router.post("/", apiKeyAuth, createBook);
router.get("/:id", getBookById);
router.put("/:id", apiKeyAuth, updateBook);
router.delete("/:id", apiKeyAuth, deleteBook);

module.exports = router;
