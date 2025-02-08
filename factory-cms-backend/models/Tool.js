const mongoose = require("mongoose");

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

module.exports = mongoose.model("Tool", ToolSchema);
