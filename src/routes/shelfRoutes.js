const router = require("express").Router();
const {
  listShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
  loadShelf,
} = require("../controllers/shelfController");
const { isAuthenticated, isOwnerOrAdmin } = require("../middleware/auth");

router.get("/", listShelves);
router.get("/:id", getShelfById);
router.post("/", isAuthenticated, createShelf);
router.put("/:id", loadShelf, isOwnerOrAdmin("ownerUserId"), updateShelf);
router.delete("/:id", loadShelf, isOwnerOrAdmin("ownerUserId"), deleteShelf);

module.exports = router;
