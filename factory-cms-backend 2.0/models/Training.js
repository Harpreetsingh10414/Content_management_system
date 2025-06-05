const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    trainingName: { type: String, required: true },
    machineCode: { type: String, required: true },
    pptPath: { type: String }, // optional
    imagePaths: [{ type: String }] // optional array of image paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
