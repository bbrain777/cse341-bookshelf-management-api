const express = require("express");
const router = express.Router();
const {
  listLoans,
  createLoan,
  getLoanById,
  updateLoan,
  deleteLoan,
} = require("../controllers/loanController");

router.get("/", listLoans);
router.post("/", createLoan);
router.get("/:id", getLoanById);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

module.exports = router;
