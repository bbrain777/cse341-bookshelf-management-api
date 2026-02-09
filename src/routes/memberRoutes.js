const router = require("express").Router();
const {
  listMembers,
  createMember,
  getMemberById,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const apiKeyAuth = require("../middleware/apiKeyAuth");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Admin-only routes
router.get("/", isAdmin, listMembers);
router.post("/", isAdmin, createMember);
router.get("/:id", isAdmin, getMemberById);
router.put("/:id", isAdmin, updateMember);
router.delete("/:id", isAdmin, deleteMember);

module.exports = router;
