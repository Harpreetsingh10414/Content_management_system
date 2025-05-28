const mongoose = require("mongoose");

const documents2p0Schema = new mongoose.Schema({
  documentName: { type: String, required: true },
  machineCode: { type: String, required: true },
  imagePath: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Documents2p0", documents2p0Schema);
