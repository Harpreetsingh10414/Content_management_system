const DailyMachine2p0 = require("../models/DailyMachine2p0");
const moment = require("moment");
const ExcelJS = require("exceljs");

/* ----------------------- helpers ----------------------- */
function parseChecks(maybeChecks) {
  // Accept Array OR JSON string (common with FormData)
  if (!maybeChecks) return [];
  if (Array.isArray(maybeChecks)) return maybeChecks;
  if (typeof maybeChecks === "string") {
    try {
      const parsed = JSON.parse(maybeChecks);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("❌ checks JSON.parse failed:", e.message);
      return [];
    }
  }
  return [];
}

function normalizeChecks(rawChecks, startAt = 1) {
  // Clean, coerce and re-index sno; drop empty descriptions
  const cleaned = rawChecks
    .map((c, idx) => {
      const snoNum = Number(c?.sno);
      return {
        sno: Number.isFinite(snoNum) && snoNum > 0 ? snoNum : startAt + idx,
        description: (c?.description || c?.desc || "").toString().trim(),
        specification: (c?.specification || c?.spec || "").toString().trim(),
        method: (c?.method || "").toString().trim(),
        frequency: (c?.frequency || "").toString().trim(),
        checkingPoint: (c?.checkingPoint || c?.image || "").toString().trim(),
      };
    })
    .filter(c => c.description); // require description minimally

  // sort by sno, then reassign sequentially to remove gaps/dupes
  cleaned.sort((a, b) => a.sno - b.sno);
  return cleaned.map((c, i) => ({ ...c, sno: startAt + i }));
}

function errorReply(res, err, fallback = "Operation failed") {
  console.error("❌ Error:", err);
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Duplicate key error", keyValue: err.keyValue });
  }
  if (err?.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      details: Object.values(err.errors).map(e => e.message),
    });
  }
  return res.status(500).json({ message: fallback, error: err });
}

/* ----------------------- controllers ----------------------- */

// Create new checksheet
exports.createChecksheet = async (req, res) => {
  try {
    const { documentNumber, machineCode, confirmBy } = req.body;
    const rawChecks = parseChecks(req.body.checks);
    const checks = normalizeChecks(rawChecks, 1);

    console.log("📥 createChecksheet body:", {
      documentNumber,
      machineCode,
      confirmBy,
      checksCount: checks.length
    });

    if (!documentNumber || !machineCode) {
      return res.status(400).json({ message: "documentNumber and machineCode are required" });
    }

    const existing = await DailyMachine2p0.findOne({ documentNumber });
    if (existing) {
      return res.status(409).json({ message: "Document number already exists" });
    }

    const sheet = new DailyMachine2p0({ documentNumber, machineCode, confirmBy, checks, submissions: [] });
    await sheet.save();

    console.log("✅ Created DailyMachine2p0:", sheet._id);
    res.status(201).json({ message: "Checksheet created successfully", sheet });
  } catch (err) {
    errorReply(res, err, "Failed to create checksheet");
  }
};

// Edit entire checksheet (Admin) — replaces checks if provided
exports.editChecksheet = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const updates = { ...req.body };

    const sheet = await DailyMachine2p0.findOne({ documentNumber });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    // If checks provided (array or string), normalize them
    if (typeof updates.checks !== "undefined") {
      const rawChecks = parseChecks(updates.checks);
      updates.checks = normalizeChecks(rawChecks, 1);
      console.log(`✏️ Replacing checks for ${documentNumber}, count=${updates.checks.length}`);
    }

    // apply other fields
    if (typeof updates.machineCode !== "undefined") sheet.machineCode = updates.machineCode;
    if (typeof updates.confirmBy !== "undefined") sheet.confirmBy = updates.confirmBy;
    if (typeof updates.checks !== "undefined") sheet.checks = updates.checks;

    await sheet.save();
    console.log(`✏️ Checksheet ${documentNumber} updated`);
    res.status(200).json({ message: "Checksheet updated successfully", sheet });
  } catch (err) {
    errorReply(res, err, "Failed to edit checksheet");
  }
};

// ✅ Bulk add steps to an existing checksheet (append safely)
exports.addSteps = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const rawChecks = parseChecks(req.body.checks);

    if (!rawChecks.length) {
      return res.status(400).json({ message: "checks array is required and cannot be empty" });
    }

    const sheet = await DailyMachine2p0.findOne({ documentNumber });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    const nextSno = (sheet.checks[sheet.checks.length - 1]?.sno || 0) + 1;
    const newSteps = normalizeChecks(rawChecks, nextSno);

    console.log(`➕ addSteps ${documentNumber}: add ${newSteps.length} steps starting at #${nextSno}`);

    sheet.checks = [...sheet.checks, ...newSteps];
    // re-normalize entire list to guarantee sequential 1..N
    sheet.checks = normalizeChecks(sheet.checks, 1);

    await sheet.save();

    res.status(200).json({ message: "Steps added successfully", totalSteps: sheet.checks.length, checks: sheet.checks });
  } catch (err) {
    errorReply(res, err, "Failed to add steps");
  }
};

// Get all checksheets by machine (lightweight list)
exports.getAllByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheets = await DailyMachine2p0
      .find({ machineCode })
      .select("documentNumber confirmBy createdAt");
    res.status(200).json(sheets);
  } catch (err) {
    errorReply(res, err, "Failed to fetch sheets");
  }
};

// Get full details by machine
exports.getDetailsByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "No checksheet found" });
    res.status(200).json(sheet);
  } catch (err) {
    errorReply(res, err, "Failed to fetch details");
  }
};

// Submit daily check (Operator)
exports.submitDailyCheck = async (req, res) => {
  try {
    const { machineCode, date, submittedBy } = req.body;
    let results = parseChecks(req.body.results);

    // normalize results: ensure OK/NG values
    results = results
      .map((r, i) => ({
        sno: Number(r?.sno) || i + 1,
        status: (r?.status || "NG").toString().toUpperCase() === "OK" ? "OK" : "NG",
      }))
      .sort((a, b) => a.sno - b.sno);

    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    const existing = sheet.submissions.find(s => s.date === date);
    if (existing) return res.status(409).json({ message: "Submission already exists for this date" });

    sheet.submissions.push({ date, submittedBy, results });
    await sheet.save();

    console.log(`📥 Submission added for ${machineCode} on ${date} with ${results.length} results`);
    res.status(200).json({ message: "Submission successful" });
  } catch (err) {
    errorReply(res, err, "Failed to submit checksheet");
  }
};

// Edit a daily submission (Admin)
exports.editSubmission = async (req, res) => {
  try {
    const { machineCode, date } = req.params;
    let results = parseChecks(req.body.results);
    results = results
      .map((r, i) => ({
        sno: Number(r?.sno) || i + 1,
        status: (r?.status || "NG").toString().toUpperCase() === "OK" ? "OK" : "NG",
      }))
      .sort((a, b) => a.sno - b.sno);

    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    const submission = sheet.submissions.find(s => s.date === date);
    if (!submission) return res.status(404).json({ message: "Submission not found for given date" });

    submission.results = results;
    submission.updatedOn = moment().format("YYYY-MM-DD");

    await sheet.save();
    console.log(`✏️ Submission updated for ${machineCode} on ${date}`);
    res.status(200).json({ message: "Submission updated successfully" });
  } catch (err) {
    errorReply(res, err, "Failed to update submission");
  }
};

// Delete entire checksheet
exports.deleteByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const deleted = await DailyMachine2p0.findOneAndDelete({ machineCode });
    if (!deleted) return res.status(404).json({ message: "Checksheet not found" });

    console.log(`🗑 Deleted checksheet for ${machineCode}`);
    res.status(200).json({ message: "Checksheet deleted successfully" });
  } catch (err) {
    errorReply(res, err, "Failed to delete checksheet");
  }
};

// Export submissions to Excel
exports.exportSubmissions = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const { fromDate, toDate } = req.query;

    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    const filteredSubs = sheet.submissions.filter(s => s.date >= fromDate && s.date <= toDate);
    if (filteredSubs.length === 0) {
      return res.status(404).json({ message: "No submissions found in given date range" });
    }

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet("Submissions Export");

    ws.columns = [
      { header: "Machine Code", key: "machineCode", width: 15 },
      { header: "Document Number", key: "documentNumber", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Submitted By", key: "submittedBy", width: 20 },
      { header: "Updated On", key: "updatedOn", width: 20 },
      { header: "S.No", key: "sno", width: 10 },
      { header: "Status", key: "status", width: 10 }
    ];

    filteredSubs.forEach(sub => {
      sub.results.forEach(r => {
        ws.addRow({
          machineCode,
          documentNumber: sheet.documentNumber,
          date: sub.date,
          submittedBy: sub.submittedBy || "-",
          updatedOn: sub.updatedOn || "-",
          sno: r.sno,
          status: r.status
        });
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${machineCode}_${fromDate}_to_${toDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

    console.log(`📤 Exported ${filteredSubs.length} submissions for ${machineCode}`);
  } catch (err) {
    errorReply(res, err, "Failed to export submissions");
  }
};
