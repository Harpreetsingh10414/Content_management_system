const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  machineCode: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("WorkInstruction2p0", stepSchema);
