const express = require("express");
const router = express.Router();
const saleHistoryController = require("../controllers/sale-history");
const auth = require("../middleware/authentication");
const validate = require("../middleware/validate");
const {
  addCommentSchema,
  updateStatusSchema,
} = require("../validators/saleHistory.validator");

// All routes require authentication
router.use(auth);

// History and comments
router.get("/:id/history", saleHistoryController.getSaleHistory);
router.post(
  "/:id/comments",
  validate(addCommentSchema),
  saleHistoryController.addSaleComment
);
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  saleHistoryController.updateSaleStatus
);
router.post("/history", saleHistoryController.createSaleHistoryWithDetails); // No Joi yet, optional to add
module.exports = router;
