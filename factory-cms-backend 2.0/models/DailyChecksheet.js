const mongoose = require("mongoose");

const checkFieldSchema = new mongoose.Schema({
  serialNo: Number,
  checkPoint: String,
  okNg: String, // OK or NG
});

const dailyChecksheetSchema = new mongoose.Schema({
  documentNumber: { type: String, required: true, unique: true }, // e.g., DMC_2025_07_001
  machineCode: { type: String, required: true },
  sheetType: { type: String, default: "Daily Machine Checksheet" },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  submittedBy: { type: String }, // Filled during submission
  updatedOn: { type: String },   // Filled when admin edits NG fields
  checks: [checkFieldSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model("DailyChecksheet", dailyChecksheetSchema);
