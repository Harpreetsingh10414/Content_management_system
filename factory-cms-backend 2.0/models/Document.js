const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  filePath: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  machineCode: {
    type: String,
    required: true,
  },
  keywords: [String],
  uploadedBy: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
