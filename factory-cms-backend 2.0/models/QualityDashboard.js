const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, // "HH:mm"
  durationMinutes: { type: Number, required: true }, // in minutes
});

const operatorSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  operatorName: { type: String, required: true },
});

const qualityDashboardSchema = new mongoose.Schema({
  machineCode: { type: String, required: true },
  date: { type: String, required: true }, // format: DD-MM-YYYY

  shift: {
    startTime: { type: String, required: true }, // "HH:mm"
    endTime: { type: String, required: true },   // "HH:mm"
    cycleTimeSeconds: { type: Number, required: true }, // e.g. 120
  },

  activities: [activitySchema],

  expectedOutput: { type: Number, required: true },

  oee: {
    targetValue: { type: Number, required: true },
    actualValue: { type: Number, required: true },
  },

  operators: [operatorSchema],

  // calculated fields
  totalShiftTimeSeconds: { type: Number, default: 0 },
  totalActivityTimeSeconds: { type: Number, default: 0 },
  runningTimeSeconds: { type: Number, default: 0 },
  runningTimeFormatted: { type: String, default: "00:00:00" },
  plannedOutput: { type: Number, default: 0 },
});

module.exports = mongoose.model("QualityDashboard", qualityDashboardSchema);
