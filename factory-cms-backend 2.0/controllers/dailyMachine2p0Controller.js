const DailyMachine2p0 = require("../models/DailyMachine2p0");
const moment = require("moment");
const ExcelJS = require("exceljs");

// 🔹 Create new checksheet
exports.createChecksheet = async (req, res) => {
  try {
    const { documentNumber, machineCode, confirmBy, checks } = req.body;

    const existing = await DailyMachine2p0.findOne({ documentNumber });
    if (existing) return res.status(409).json({ message: "Document number already exists" });

    const sheet = new DailyMachine2p0({ documentNumber, machineCode, confirmBy, checks });

    await sheet.save();
    console.log("✅ Created new DailyMachine2p0 sheet:", sheet);
    res.status(201).json({ message: "Checksheet created successfully", sheet });
  } catch (err) {
    console.error("❌ Create Error:", err);
    res.status(500).json({ message: "Failed to create checksheet", error: err });
  }
};

// 🔹 Edit entire checksheet (Admin)
exports.editChecksheet = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const updates = req.body; // { checks, confirmBy, machineCode }

    const sheet = await DailyMachine2p0.findOne({ documentNumber });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    Object.assign(sheet, updates);
    await sheet.save();

    console.log(`✏️ Checksheet ${documentNumber} updated by Admin`);
    res.status(200).json({ message: "Checksheet updated successfully", sheet });
  } catch (err) {
    console.error("❌ Edit Checksheet Error:", err);
    res.status(500).json({ message: "Failed to edit checksheet", error: err });
  }
};

// 🔹 Get all checksheets by machine
exports.getAllByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheets = await DailyMachine2p0.find({ machineCode }).select("documentNumber confirmBy createdAt");
    res.status(200).json(sheets);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch sheets", error: err });
  }
};

// 🔹 Get full details by machine
exports.getDetailsByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "No checksheet found" });
    res.status(200).json(sheet);
  } catch (err) {
    console.error("❌ Details Error:", err);
    res.status(500).json({ message: "Failed to fetch details", error: err });
  }
};

// 🔹 Submit daily check (Operator)
exports.submitDailyCheck = async (req, res) => {
  try {
    const { machineCode, date, submittedBy, results } = req.body;

    const sheet = await DailyMachine2p0.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Checksheet not found" });

    const existing = sheet.submissions.find(s => s.date === date);
    if (existing) return res.status(409).json({ message: "Submission already exists for this date" });

    sheet.submissions.push({ date, submittedBy, results });
    await sheet.save();

    console.log(`📥 Submission added for ${machineCode} on ${date}`);
    res.status(200).json({ message: "Submission successful" });
  } catch (err) {
    console.error("❌ Submit Error:", err);
    res.status(500).json({ message: "Failed to submit checksheet", error: err });
  }
};

// 🔹 Edit a daily submission (Admin)
exports.editSubmission = async (req, res) => {
  try {
    const { machineCode, date } = req.params;
    const { results } = req.body;

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
    console.error("❌ Edit Submission Error:", err);
    res.status(500).json({ message: "Failed to update submission", error: err });
  }
};

// 🔹 Delete entire checksheet
exports.deleteByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const deleted = await DailyMachine2p0.findOneAndDelete({ machineCode });
    if (!deleted) return res.status(404).json({ message: "Checksheet not found" });

    console.log(`🗑 Deleted checksheet for ${machineCode}`);
    res.status(200).json({ message: "Checksheet deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ message: "Failed to delete checksheet", error: err });
  }
};

// 🔹 Export submissions to Excel
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
    console.error("❌ Export Error:", err);
    res.status(500).json({ message: "Failed to export submissions", error: err });
  }
};
