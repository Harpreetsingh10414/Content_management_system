const mongoose = require("mongoose");

const onePointLesson2p0Schema = new mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  machineCode: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("OnePointLesson2p0", onePointLesson2p0Schema);
