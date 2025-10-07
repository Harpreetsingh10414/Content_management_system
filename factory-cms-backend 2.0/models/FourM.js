const mongoose = require("mongoose");

const fourMSchema = new mongoose.Schema({
  machineCode: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  entries: [
    {
      sno: { type: Number, required: true },
      man: { type: String, default: "" },
      machine: { type: String, default: "" },
      material: { type: String, default: "" },
      method: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("FourM", fourMSchema);
