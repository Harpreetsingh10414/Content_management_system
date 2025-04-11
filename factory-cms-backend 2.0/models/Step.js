const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  stepNumber: { type: Number, required: true },
  description: String,
  mediaType: String,
  mediaUrl: String,
  toolsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tool" }],
  partsInvolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Part" }],
  machineCode: { type: String, required: true }
});

module.exports = mongoose.model("Step", stepSchema);
