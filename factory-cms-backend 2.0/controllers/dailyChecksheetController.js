const DailyChecksheet = require("../models/DailyChecksheet");
const moment = require("moment");

// Create new checksheet
exports.createChecksheet = async (req, res) => {
  try {
    const { documentNumber, machineCode, month, year, checks, date } = req.body;

    const existing = await DailyChecksheet.findOne({ documentNumber });
    if (existing) return res.status(409).json({ message: "Document number already exists" });

    const sheet = new DailyChecksheet({
      documentNumber,
      machineCode,
      month,
      year,
      date,
      checks,
    });

    await sheet.save();
    console.log("✅ Checksheet created:", sheet);
    res.status(201).json({ message: "Checksheet created successfully", sheet });
  } catch (err) {
    console.error("❌ Create Error:", err);
    res.status(500).json({ message: "Failed to create checksheet", error: err });
  }
};

// Operator submits today's sheet
exports.submitChecksheet = async (req, res) => {
  try {
    const { documentNumber, date, submittedBy, checks } = req.body;

    const sheet = await DailyChecksheet.findOne({ documentNumber, date });
    if (!sheet) return res.status(404).json({ message: "Sheet not found for today" });

    sheet.checks = checks;
    sheet.submittedBy = submittedBy;
    await sheet.save();

    console.log("📥 Submitted by operator:", submittedBy, "on", date);
    res.status(200).json({ message: "Sheet submitted successfully" });
  } catch (err) {
    console.error("❌ Submission Error:", err);
    res.status(500).json({ message: "Submission failed", error: err });
  }
};

// Admin edits full sheet by documentNumber
exports.editChecksheetByDocNo = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const updates = req.body;

    const sheet = await DailyChecksheet.findOne({ documentNumber });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    Object.assign(sheet, updates); // Directly update any field
    await sheet.save();

    console.log("✏️ Edited by Admin:", documentNumber);
    res.status(200).json({ message: "Sheet updated", sheet });
  } catch (err) {
    console.error("❌ Admin Edit Error:", err);
    res.status(500).json({ message: "Edit failed", error: err });
  }
};

// Admin edits OK/NG only
exports.updateCheckStatus = async (req, res) => {
  try {
    const { documentNumber, date } = req.params;
    const { checks } = req.body;

    const sheet = await DailyChecksheet.findOne({ documentNumber, date });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    sheet.checks = checks;
    sheet.updatedOn = moment().format("YYYY-MM-DD");
    await sheet.save();

    console.log("🔁 OK/NG edited by Admin on", date);
    res.status(200).json({ message: "Check statuses updated" });
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ message: "Failed to update checks", error: err });
  }
};

// Get all sheets by machine
exports.getAllByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheets = await DailyChecksheet.find({ machineCode }).select("documentNumber date");
    res.status(200).json(sheets);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch sheets", error: err });
  }
};

// Get details by document number and date
exports.getSheetDetails = async (req, res) => {
  try {
    const { documentNumber, date } = req.params;
    const sheet = await DailyChecksheet.findOne({ documentNumber, date });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    res.status(200).json(sheet);
  } catch (err) {
    console.error("❌ Details Error:", err);
    res.status(500).json({ message: "Failed to fetch sheet", error: err });
  }
};
