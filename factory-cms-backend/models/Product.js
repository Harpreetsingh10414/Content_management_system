const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  language: { type: String, required: true, default: "en" },
});

module.exports = mongoose.model("Product", ProductSchema);
