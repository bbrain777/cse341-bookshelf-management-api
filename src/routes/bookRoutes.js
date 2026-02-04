const router = require("express").Router();
const {
  listBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

router.get("/", listBooks);
router.post("/", createBook);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
