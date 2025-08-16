const mongoose = require("mongoose");

const checkItemSchema = new mongoose.Schema({
  sno: { type: Number, required: true },
  description: { type: String, required: true },
  specification: { type: String, required: true },
  method: { type: String, required: true },
  frequency: { type: String, required: true },
  checkingPoint: { type: String } // File path or image URL
});

const dailyMachineChecksheetSchema = new mongoose.Schema({
  documentNumber: { type: String, required: true, unique: true }, // e.g., DMC2_2025_08_001
  machineCode: { type: String, required: true },
  confirmBy: { type: String, required: true }, // Line Leader or responsible person
  checks: [checkItemSchema],

  // Daily submissions stored date-wise
  submissions: [
    {
      date: { type: String, required: true }, // YYYY-MM-DD
      submittedBy: { type: String },
      updatedOn: { type: String },
      results: [
        {
          sno: Number,
          status: { type: String, enum: ["OK", "NG"], default: "OK" }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("DailyMachine2p0", dailyMachineChecksheetSchema);
