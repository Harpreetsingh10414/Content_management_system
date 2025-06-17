const mongoose = require("mongoose");

const onePointLessonSchema = new mongoose.Schema({
  lessonName: { type: String, required: true },
  machineCode: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("OnePointLesson2p0", onePointLessonSchema);
