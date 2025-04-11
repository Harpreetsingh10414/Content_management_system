const mongoose = require('mongoose');

const onePointLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  language: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdBy: { type: String, required: true },
  approvedBy: { type: String },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedAt: { type: Date },
  machineCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OnePointLesson', onePointLessonSchema);