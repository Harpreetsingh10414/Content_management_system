const mongoose = require("mongoose");

const drawingSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  fileType: { type: String, required: true }, // e.g., pdf, jpeg
  machineCode: { type: String, required: true },
  createdBy: { type: String, required: true },
  approvedBy: { type: String, required: true },
  date: { type: String, required: true }, // store as YYYY-MM-DD
  revision: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Drawing", drawingSchema);
