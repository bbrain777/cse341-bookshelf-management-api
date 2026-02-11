const express = require("express");
const router = express.Router();
const {
  listLoans,
  createLoan,
  getLoanById,
  updateLoan,
  deleteLoan,
} = require("../controllers/loanController");
const { isAdmin } = require("../middleware/auth");

router.get("/", isAdmin, listLoans);
router.post("/", isAdmin, createLoan);
router.get("/:id", isAdmin, getLoanById);
router.put("/:id", isAdmin, updateLoan);
router.delete("/:id", isAdmin, deleteLoan);

module.exports = router;
