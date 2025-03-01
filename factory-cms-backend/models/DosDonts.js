const mongoose = require("mongoose");

const DosDontsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  imagePath: { type: String, required: true },
  createdBy: { type: String, required: true },
  approvedBy: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  revision: { type: String, required: true },
});

module.exports = mongoose.model("DosDonts", DosDontsSchema);
