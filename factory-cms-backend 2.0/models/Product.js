// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // e.g., PRD_001
  name: { type: String, required: true },                 // e.g., Handle Assembly
});

module.exports = mongoose.model("Product", productSchema);
