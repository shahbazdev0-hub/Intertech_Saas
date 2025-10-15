const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  action: String,
  status: String,
  reason: String,
  rejectionReason: String,
  notes: String,
  nextAction: String,
  qualityScore: Number,
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  systemData: {
    browser: String,
    device: String,
  },
  actionBy: {
    id: String,
    name: String,
    email: String,
    role: String,
  },
});

const commentSchema = new mongoose.Schema({
  comment: String,
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  systemData: {
    browser: String,
    device: String,
  },
  actionBy: {
    id: String,
    name: String,
    email: String,
    role: String,
  },
});

const saleHistorySchema = new mongoose.Schema({
  identifier: String,
  // Optional sale or lead reference
  sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: false },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: false },
  autoSale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AutoSale",
    required: false,
  },
  status: { type: String, default: "pending" },
  history: [historySchema],
  comments: [commentSchema],
});

module.exports = mongoose.model("SaleHistory", saleHistorySchema);
