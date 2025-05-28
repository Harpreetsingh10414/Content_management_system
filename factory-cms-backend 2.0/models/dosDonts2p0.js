const mongoose = require("mongoose");

const dosDonts2p0Schema = new mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  machineCode: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("DosDonts2p0", dosDonts2p0Schema);
