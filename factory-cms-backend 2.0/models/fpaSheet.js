const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  drawingParameter: { type: String, required: true },
  specification: { type: String, required: true },
  inspectionInstrument: { type: String, required: true },
  valueType: { type: String, enum: ["text", "range"], required: true },
  minValue: { type: Number },  // only if range
  maxValue: { type: Number }
});

const submissionSchema = new mongoose.Schema({
  submittedAt: { type: Date, default: Date.now },
  submittedBy: { type: String, required: true },
  values: [
    {
      stepNumber: Number,
      FPA01: { value: String, status: { type: String, enum: ["OK", "NG"] }, remarks: String },
      FPA02: { value: String, status: { type: String, enum: ["OK", "NG"] }, remarks: String },
      Mid01: { value: String, status: { type: String, enum: ["OK", "NG"] }, remarks: String },
      LPA01: { value: String, status: { type: String, enum: ["OK", "NG"] }, remarks: String }
    }
  ]
});

const fpaSheetSchema = new mongoose.Schema({
  sheetName: { type: String, required: true },
  machineCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  steps: [stepSchema],
  submissions: [submissionSchema]
});

module.exports = mongoose.model("FPASheet", fpaSheetSchema);
