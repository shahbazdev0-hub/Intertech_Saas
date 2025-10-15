const Joi = require("joi");

exports.addCommentSchema = Joi.object({
  comment: Joi.string().min(5).required(),
  systemData: Joi.object({
    browser: Joi.string().optional(),
    device: Joi.string().optional(),
  }).optional(),
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "under_review",
      "approved",
      "rejected",
      "requires_revision",
      "escalated"
    )
    .required(),
  reason: Joi.string().min(10).required(),
  rejectionReason: Joi.string().optional(),
  notes: Joi.string().optional(),
  systemData: Joi.object({
    browser: Joi.string().optional(),
    device: Joi.string().optional(),
  }).optional(),
});
exports.addHistorySchema = Joi.object({
  action: Joi.string().optional(),
  status: Joi.string().optional(),
  reason: Joi.string().optional(),
  rejectionReason: Joi.string().optional(),
  notes: Joi.string().optional(),
  nextAction: Joi.string().optional(),
  qualityScore: Joi.number().min(1).max(10).optional(),
  systemData: Joi.object({
    browser: Joi.string().optional(),
    device: Joi.string().optional(),
  }).optional(),
});
