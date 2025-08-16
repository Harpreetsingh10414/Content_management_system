const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  description: { type: String, required: true },
  specification: { type: String, default: "" },
  method: { type: String, default: "" },
  frequency: { type: String, default: "" },
  checkingPoint: { type: String, default: "" } // store image path if any
}, { _id: false });

const resultSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  status: { type: String, enum: ["OK", "NG"], default: "NG" }
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  submittedBy: { type: String, default: "" },
  updatedOn: { type: String, default: "" },
  results: { type: [resultSchema], default: [] }
}, { _id: false });

const dailyMachine2p0Schema = new mongoose.Schema({
  documentNumber: { type: String, required: true, unique: true },
  machineCode: { type: String, required: true },
  confirmBy: { type: String, default: "" },
  checks: { type: [checkSchema], default: [] },
  submissions: { type: [submissionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("DailyMachine2p0", dailyMachine2p0Schema);
