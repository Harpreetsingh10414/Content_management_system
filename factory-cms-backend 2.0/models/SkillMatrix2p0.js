const mongoose = require("mongoose");

const skillMatrix2p0Schema = new mongoose.Schema({
  name: { type: String, required: true },
  machineCode: { type: String, required: true },
  imagePath: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("SkillMatrix2p0", skillMatrix2p0Schema);
