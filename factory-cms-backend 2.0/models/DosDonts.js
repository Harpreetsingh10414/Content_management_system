const mongoose = require("mongoose");

const dosDontsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  createdBy: { type: String, required: true },
  approvedBy: { type: String, required: true },
  revision: { type: String, required: true },
  imagePath: { type: String, required: true },
  machineCode: { type: String, required: true }, // ✅ NEW
}, {
  timestamps: true,
});

module.exports = mongoose.model("DosDonts", dosDontsSchema);
