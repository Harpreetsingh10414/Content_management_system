const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  deviceID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["server", "client"], default: "client" },
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Machine", machineSchema);
