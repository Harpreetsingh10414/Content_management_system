const DailyChecksheet = require("../models/DailyChecksheet");
const moment = require("moment");
const ExcelJS = require("exceljs");

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

    // Fetch only the required fields
    const sheets = await DailyChecksheet.find({ machineCode })
      .select("documentNumber date")
      .lean();

    // Convert date to YYYY-MM-DD format for frontend
    const formattedSheets = sheets.map(sheet => ({
      documentNumber: sheet.documentNumber,
      date: sheet.date ? new Date(sheet.date).toISOString().split("T")[0] : null
    }));

    console.log(`✅ Found ${formattedSheets.length} sheets for machine ${machineCode}`);
    res.status(200).json(formattedSheets);
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

// Delete a check from the sheet by serialNo
exports.deleteStepFromChecksheet = async (req, res) => {
  try {
    const { documentNumber, serialNo } = req.params;

    const sheet = await DailyChecksheet.findOne({ documentNumber });
    if (!sheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }

    // Filter out the check with the given serialNo
    const updatedChecks = sheet.checks.filter(check => check.serialNo != serialNo);

    if (updatedChecks.length === sheet.checks.length) {
      return res.status(404).json({ message: "Check not found in this checksheet" });
    }

    // Reassign serial numbers
    const rearrangedChecks = updatedChecks.map((check, index) => ({
      ...check.toObject(),
      serialNo: index + 1
    }));

    sheet.checks = rearrangedChecks;
    await sheet.save();

    res.status(200).json({
      message: `Check with serialNo ${serialNo} deleted and checks rearranged.`,
      updatedChecks: sheet.checks
    });
  } catch (error) {
    console.error("❌ Error deleting check:", error);
    res.status(500).json({ message: "Failed to delete check", error });
  }
};

// DELETE checksheet by documentNumber
exports.deleteChecksheetByDocNumber = async (req, res) => {
  try {
    const { documentNumber } = req.params;

    const deletedSheet = await DailyChecksheet.findOneAndDelete({ documentNumber });

    if (!deletedSheet) {
      return res.status(404).json({ message: "Checksheet not found." });
    }

    console.log(`Checksheet with Document No: ${documentNumber} deleted.`);
    res.status(200).json({
      message: "Checksheet deleted successfully.",
      deletedDocument: deletedSheet,
    });
  } catch (error) {
    console.error("Error deleting checksheet:", error);
    res.status(500).json({ message: "Server error while deleting checksheet." });
  }
};


// Export to Excel
exports.exportChecksheetToExcel = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Both fromDate and toDate are required." });
    }

    const sheets = await DailyChecksheet.find({
      documentNumber,
      date: { $gte: fromDate, $lte: toDate }
    });

    if (sheets.length === 0) {
      console.log(`[EXPORT ERROR] No data found for document: ${documentNumber} between ${fromDate} and ${toDate}`);
      return res.status(404).json({ message: "No checksheets found for given document number and date range." });
    }

    // Excel workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Checksheet Export");

    // Header row
    worksheet.columns = [
      { header: "Document Number", key: "documentNumber", width: 20 },
      { header: "Machine Code", key: "machineCode", width: 15 },
      { header: "Date", key: "date", width: 15 },
      { header: "Submitted By", key: "submittedBy", width: 20 },
      { header: "Updated On", key: "updatedOn", width: 20 },
      { header: "Step No", key: "serialNo", width: 10 },
      { header: "Check Point", key: "checkPoint", width: 30 },
      { header: "OK/NG", key: "okNg", width: 10 }
    ];

    // Fill rows
    sheets.forEach(sheet => {
      sheet.checks.forEach(check => {
        worksheet.addRow({
          documentNumber: sheet.documentNumber,
          machineCode: sheet.machineCode,
          date: sheet.date,
          submittedBy: sheet.submittedBy || "-",
          updatedOn: sheet.updatedOn || "-",
          serialNo: check.serialNo,
          checkPoint: check.checkPoint,
          okNg: check.okNg
        });
      });
    });

    // Response headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${documentNumber}_${fromDate}_to_${toDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

    console.log(`[EXPORT SUCCESS] Exported ${sheets.length} sheet(s) for ${documentNumber} to Excel`);

  } catch (error) {
    console.error("[EXPORT ERROR]", error);
    res.status(500).json({ message: "Error while exporting to Excel", error });
  }
};