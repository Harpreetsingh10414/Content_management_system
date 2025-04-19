const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  serialNo: String,
  checkMethod: String, // File path
  station: String,
  permissible: String,
  checkPoint: String,
  planTime: String,
  frequency: String,
  remark: String,
  actualTime: String,
  actionTaken: String,
});

const checksheetSchema = new mongoose.Schema({
  machineCode: { type: String, required: true },
  date: { type: Date, required: true },
  createdBy: String,
  checks: [checkSchema],
});

module.exports = mongoose.model("Checksheet", checksheetSchema);
