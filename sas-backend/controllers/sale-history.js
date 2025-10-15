const SaleHistory = require("../models/SaleHistory");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError } = require("../errors");
const Joi = require("joi");
// GET /api/sales/:id/history
exports.getSaleHistory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new UnauthenticatedError("Id is required!");
  }
  const response = await SaleHistory.find({
    $or: [{ sale: id }, { lead: id }, { autoSale: id }],
  });
  if (!response) throw new UnauthenticatedError("Sale History not found!");
  return res.status(StatusCodes.OK).json({ history: response });
};

// POST /api/sales/:id/comments
exports.addSaleComment = async (req, res) => {
  const { id } = req.params;
  const { comment, systemData } = req.body;
  const { user } = req;

  if (!id) throw new UnauthenticatedError("Sale ID is required");

  const response = await SaleHistory.findOne(id);
  if (!response) throw new NotFoundError("Sale not found");

  response.comments.push({
    comment,
    actionBy: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    ipAddress: req.ip,
    systemData,
  });

  await response.save();
  return res.status(StatusCodes.OK).json({ msg: "Comment added successfully" });
};

// PATCH /api/sales/:id/status
exports.updateSaleStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason, rejectionReason, notes, systemData } = req.body;
  const { user } = req;

  if (!id) throw new UnauthenticatedError("Sale ID is required");

  const response = await SaleHistory.findById(id);
  if (!response) throw new NotFoundError("Sale not found");

  response.history.push({
    action: "Status Updated",
    status,
    reason,
    rejectionReason,
    notes,
    actionBy: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    ipAddress: req.ip,
    systemData,
  });

  response.status = status;
  await response.save();

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Sale status updated successfully" });
};
const fullSaleHistorySchema = Joi.object({
  sale: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Sale ID must be a valid MongoDB ObjectId",
    }),
  autoSale: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Sale ID must be a valid MongoDB ObjectId",
    }),
  lead: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Lead ID must be a valid MongoDB ObjectId",
    }),
  identifier: Joi.string().optional(),
  history: Joi.array()
    .items(
      Joi.object({
        action: Joi.string().required(),
        status: Joi.string()
          .valid(
            "pending",
            "under_review",
            "approved",
            "rejected",
            "red_flag",
            "escalated"
          )
          .required(),
        reason: Joi.string().allow("").optional(),
        rejectionReason: Joi.string().when("status", {
          is: "rejected",
          then: Joi.string().min(3).required().messages({
            "any.required":
              "Rejection reason is required when status is rejected",
          }),
          otherwise: Joi.string().allow("").optional(),
        }),
        notes: Joi.string().allow("").optional(),
        nextAction: Joi.string().allow("").optional(),
        qualityScore: Joi.number().min(0).max(10).required(),
        systemData: Joi.object({
          browser: Joi.string().optional(),
          device: Joi.string().optional(),
        }).optional(),
      })
    )
    .optional(),
  comments: Joi.array()
    .items(
      Joi.object({
        comment: Joi.string().min(5).required(),
        systemData: Joi.object({
          browser: Joi.string().optional(),
          device: Joi.string().optional(),
        }).optional(),
      })
    )
    .optional(),
});
exports.createSaleHistoryWithDetails = async (req, res) => {
  const { error } = fullSaleHistorySchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const details = error.details.map((d) => d.message).join(", ");
    throw new UnauthenticatedError(`Validation Error: ${details}`);
  }
  const {
    autoSale,
    lead,
    sale,
    identifier,
    history = [],
    comments = [],
  } = req.body;
  const { user } = req;

  // Check if already exists
  // let existing = await SaleHistory.findOne({ sale });
  // if (existing) {
  //   return res
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ msg: "Sale history already exists for this sale" });
  // }

  // Attach user + metadata to each history/comment item
  const buildActionBy = () => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const ipAddress = req.ip;

  const enrichHistory = history.map((item) => ({
    ...item,
    ipAddress,
    actionBy: buildActionBy(),
    timestamp: item?.timestamp || new Date(),
  }));

  const enrichComments = comments.map((item) => ({
    ...item,
    ipAddress,
    actionBy: buildActionBy(),
    timestamp: item.timestamp || new Date(),
  }));

  const newSaleHistory = new SaleHistory({
    identifier: identifier || `SALE-${Date.now()}`,
    sale: sale,
    lead: lead,
    autoSale: autoSale,
    status: history[history.length - 1]?.status || "pending",
    history: enrichHistory,
    comments: enrichComments,
  });

  await newSaleHistory.save();

  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Sale history record created successfully" });
};
