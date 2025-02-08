const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  stepNumber: { type: Number, required: true },
  description: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video", "pdf"], required: true },
  mediaUrl: { type: String, required: true },
  toolsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tool" }],
  partsInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Part" }],
}, { timestamps: true });

module.exports = mongoose.model("Step", StepSchema);
