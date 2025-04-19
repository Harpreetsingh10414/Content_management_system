const Checksheet = require("../models/Checksheet");
const ExcelJS = require("exceljs");

// ✅ Create a new Checksheet
exports.createChecksheet = async (req, res) => {
  try {
    const { machineCode, date, createdBy } = req.body;

    if (!machineCode || !date) {
      return res.status(400).json({ message: "machineCode and date are required" });
    }

    const existing = await Checksheet.findOne({ machineCode, date: new Date(date) });
    if (existing) {
      return res.status(400).json({ message: "Checksheet already exists for this date and machine" });
    }

    const checksheet = new Checksheet({
      machineCode,
      date,
      createdBy,
      checks: [],
    });

    await checksheet.save();
    res.status(201).json({ message: "Checksheet created successfully", checksheet });
  } catch (error) {
    res.status(500).json({ message: "Error creating checksheet", error });
  }
};

// ✅ Add a check to a Checksheet
exports.addCheckToChecksheet = async (req, res) => {
  try {
    const { checksheetId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);

    if (!checksheet) return res.status(404).json({ message: "Checksheet not found" });
    if (!req.file) return res.status(400).json({ message: "Check method image is required" });

    const check = {
      serialNo: req.body.serialNo,
      checkMethod: req.file.path,
      station: req.body.station,
      permissible: req.body.permissible,
      checkPoint: req.body.checkPoint,
      planTime: req.body.planTime,
      frequency: req.body.frequency,
      remark: req.body.remark,
      actualTime: req.body.actualTime,
      actionTaken: req.body.actionTaken,
    };

    checksheet.checks.push(check);
    await checksheet.save();

    res.status(201).json({ message: "Check added successfully", check });
  } catch (error) {
    res.status(500).json({ message: "Error adding check", error });
  }
};

// ✅ Get monthly checksheets by machineCode
exports.getMonthlyChecksheets = async (req, res) => {
  try {
    const { machineCode, year, month } = req.query;

    if (!machineCode || !year || !month) {
      return res.status(400).json({ message: "machineCode, year, and month are required" });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const checksheets = await Checksheet.find({
      machineCode,
      date: { $gte: startDate, $lt: endDate },
    });

    res.status(200).json(checksheets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly checksheets", error });
  }
};

// ✅ Export monthly checksheet data as Excel
exports.exportMonthlyExcel = async (req, res) => {
  try {
    const { machineCode, year, month } = req.query;

    if (!machineCode || !year || !month) {
      return res.status(400).json({ message: "machineCode, year, and month are required" });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const checksheets = await Checksheet.find({
      machineCode,
      date: { $gte: startDate, $lt: endDate },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Monthly Checksheet");

    // Header row
    worksheet.addRow([
      "Date",
      "Machine Code",
      "Serial No",
      "Station",
      "Check Point",
      "Permissible",
      "Plan Time",
      "Actual Time",
      "Frequency",
      "Remark",
      "Action Taken",
    ]);

    checksheets.forEach(sheet => {
      sheet.checks.forEach(check => {
        worksheet.addRow([
          sheet.date?.toISOString().split("T")[0] || "",
          sheet.machineCode || "",
          check.serialNo || "",
          check.station || "",
          check.checkPoint || "",
          check.permissible || "",
          check.planTime || "",
          check.actualTime || "",
          check.frequency || "",
          check.remark || "",
          check.actionTaken || "",
        ]);
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=checksheet_${month}_${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: "Error generating Excel", error });
  }
};

// ✅ Get all checksheets
exports.getAllChecksheets = async (req, res) => {
  try {
    const checksheets = await Checksheet.find();
    res.status(200).json(checksheets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checksheets", error });
  }
};

// ✅ Delete a specific check from a checksheet
exports.deleteCheckFromChecksheet = async (req, res) => {
  try {
    const { checksheetId, checkId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);
    if (!checksheet) return res.status(404).json({ message: "Checksheet not found" });

    checksheet.checks = checksheet.checks.filter(check => check._id.toString() !== checkId);
    await checksheet.save();

    res.status(200).json({ message: "Check removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing check", error });
  }
};

exports.deleteChecksheet = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Checksheet.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Checksheet not found" });

    res.status(200).json({ message: "Checksheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting checksheet", error });
  }
};

exports.getChecksByChecksheetId = async (req, res) => {
  try {
    const { checksheetId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);

    if (!checksheet) return res.status(404).json({ message: "Checksheet not found" });

    res.status(200).json(checksheet.checks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving checks", error });
  }
};

exports.getChecksheetById = async (req, res) => {
  try {
    const { id } = req.params;
    const checksheet = await Checksheet.findById(id);

    if (!checksheet) return res.status(404).json({ message: "Checksheet not found" });

    res.status(200).json(checksheet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checksheet", error });
  }
};
