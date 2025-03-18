const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  filePath: { type: String, required: true },
  language: { type: String, required: true }, // Multilingual support
  keywords: [{ type: String }], // Keywords extracted for search optimization
  version: { type: Number, default: 1 }, // Documentation control
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
