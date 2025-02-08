const mongoose = require("mongoose");

const PartSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

module.exports = mongoose.model("Part", PartSchema);
