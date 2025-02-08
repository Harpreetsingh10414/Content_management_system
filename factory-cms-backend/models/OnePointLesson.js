const mongoose = require("mongoose");

const OnePointLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  language: { type: String, required: true, default: "en" }, // Multilingual support
  imageUrl: { type: String, required: true }, // Image file URL
  createdBy: { type: String, required: true }, // Creator of the lesson
  approvedBy: { type: String }, // Approver name
  approvalStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

module.exports = mongoose.model("OnePointLesson", OnePointLessonSchema);
