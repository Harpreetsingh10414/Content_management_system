const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  serialNo: { type: Number, required: true },
  checkMethod: { type: String, required: true }, // File path instead of URL
  station: { type: String, required: true },
  permissible: { type: String, required: true },
  checkPoint: { type: String, required: true },
  planTime: { type: Number, required: true }, // in minutes
  frequency: { type: String, required: true },
  remark: { type: String },
  actualTime: { type: Number },
  actionTaken: { type: String }
}, { _id: true });

const checksheetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  formatNo: { type: String },
  issueNoDate: { type: String },
  revNoDate: { type: String },
  pageNo: { type: String },
  machineName: { type: String },
  identificationNo: { type: String },
  location: { type: String },
  maintenanceTechnician: { type: String },
  maintenanceHOD: { type: String },
  pmDoneDate: { type: Date },
  pmNextDueDate: { type: Date },
  checks: [checkSchema], // Array of checks
}, { timestamps: true });

module.exports = mongoose.model("Checksheet", checksheetSchema);
