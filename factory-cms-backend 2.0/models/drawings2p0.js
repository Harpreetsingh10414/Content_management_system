const mongoose = require("mongoose");

const drawings2p0Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    machineCode: { type: String, required: true },
    imagePath: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawings2p0", drawings2p0Schema);
