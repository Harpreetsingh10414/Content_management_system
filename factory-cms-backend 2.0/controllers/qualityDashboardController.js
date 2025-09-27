const QualityDashboard = require("../models/QualityDashboard");
const moment = require("moment");

/* -------------------- Helpers -------------------- */
function formatSecondsToHHMMSS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function recalc(dashboard) {
  // total shift time
  const start = moment(dashboard.shift.startTime, "HH:mm");
  const end = moment(dashboard.shift.endTime, "HH:mm");
  let totalShiftTimeSeconds = end.diff(start, "seconds");
  if (totalShiftTimeSeconds < 0) {
    totalShiftTimeSeconds += 24 * 3600; // handle overnight shifts
  }

  // activities
  const totalActivityTimeSeconds = dashboard.activities.reduce(
    (acc, a) => acc + a.durationMinutes * 60,
    0
  );

  // running time
  const runningTimeSeconds = totalShiftTimeSeconds - totalActivityTimeSeconds;
  const runningTimeFormatted = formatSecondsToHHMMSS(runningTimeSeconds);

  // planned output
  let plannedOutput = 0;
  if (dashboard.shift.cycleTimeSeconds > 0) {
    plannedOutput = Math.floor(runningTimeSeconds / dashboard.shift.cycleTimeSeconds);
  }

  dashboard.totalShiftTimeSeconds = totalShiftTimeSeconds;
  dashboard.totalActivityTimeSeconds = totalActivityTimeSeconds;
  dashboard.runningTimeSeconds = runningTimeSeconds;
  dashboard.runningTimeFormatted = runningTimeFormatted;
  dashboard.plannedOutput = plannedOutput;

  return dashboard;
}

/* -------------------- Controllers -------------------- */

// Create new dashboard for the day
exports.createDashboard = async (req, res) => {
  try {
    const dashboard = new QualityDashboard(req.body);
    recalc(dashboard);
    await dashboard.save();
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get dashboard by machineCode + date
exports.getDashboardByMachineAndDate = async (req, res) => {
  try {
    const { machineCode, date } = req.params;
    const dashboard = await QualityDashboard.findOne({ machineCode, date });
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit dashboard by machineCode + date
exports.updateDashboardByMachineAndDate = async (req, res) => {
  try {
    const { machineCode, date } = req.params;

    let dashboard = await QualityDashboard.findOne({ machineCode, date });
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    // update with new values
    Object.assign(dashboard, req.body);

    // recalc values
    recalc(dashboard);

    await dashboard.save();
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
