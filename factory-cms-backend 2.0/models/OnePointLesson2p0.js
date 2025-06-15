const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  imagePath: { type: String, required: true },
  description: { type: String, required: true }
});

const onePointLesson2p0Schema = new mongoose.Schema({
  name: { type: String, required: true },
  machineCode: { type: String, required: true },
  steps: [stepSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model("OnePointLesson2p0", onePointLesson2p0Schema);