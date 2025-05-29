const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    trainingName: { type: String, required: true },
    machineCode: { type: String, required: true },
    filePath: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
