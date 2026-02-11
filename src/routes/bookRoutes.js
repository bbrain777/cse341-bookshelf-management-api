const router = require("express").Router();
const {
  listBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { isAdmin } = require("../middleware/auth");

router.get("/", listBooks);
router.post("/", isAdmin, createBook);
router.get("/:id", getBookById);
router.put("/:id", isAdmin, updateBook);
router.delete("/:id", isAdmin, deleteBook);

module.exports = router;
