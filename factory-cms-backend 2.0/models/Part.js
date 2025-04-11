const mongoose = require("mongoose");

const partSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});

module.exports = mongoose.model("Part", partSchema);
