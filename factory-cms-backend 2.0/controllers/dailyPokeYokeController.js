const DailyPokeYokeChecksheet = require("../models/DailyPokeYokeChecksheet");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

// ✅ Create a new check sheet
exports.createChecksheet = async (req, res) => {
  try {
    console.log("📄 Creating new Poke Yoke Checksheet with images");

    const { documentName, machineCode, checkedBy, verifiedBy, checkItems } = req.body;
    let parsedCheckItems = JSON.parse(checkItems);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (parsedCheckItems[index]) {
          parsedCheckItems[index].photo = `uploads/pokeyoke/${file.filename}`;
        }
      });
    }

    const sheet = new DailyPokeYokeChecksheet({
      documentName,
      machineCode,
      checkedBy,
      verifiedBy,
      checkItems: parsedCheckItems,
    });

    await sheet.save();
    res.status(201).json(sheet);
  } catch (err) {
    console.error("❌ Error creating checksheet:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Get check sheet by machine code
exports.getChecksheetByMachine = async (req, res) => {
  try {
    console.log("📄 Fetching Poke Yoke Checksheet for machine:", req.params.machineCode);
    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode: req.params.machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });
    res.json(sheet);
  } catch (err) {
    console.error("❌ Error fetching checksheet:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Edit check sheet
exports.editChecksheet = async (req, res) => {
  try {
    console.log("✏ Editing checksheet for machine:", req.params.machineCode);
    const updatedSheet = await DailyPokeYokeChecksheet.findOneAndUpdate(
      { machineCode: req.params.machineCode },
      { ...req.body, revisedDate: new Date() },
      { new: true }
    );
    if (!updatedSheet) return res.status(404).json({ error: "Checksheet not found" });
    res.json(updatedSheet);
  } catch (err) {
    console.error("❌ Error editing checksheet:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete check sheet
exports.deleteChecksheet = async (req, res) => {
  try {
    console.log("🗑 Deleting checksheet for machine:", req.params.machineCode);
    const deleted = await DailyPokeYokeChecksheet.findOneAndDelete({ machineCode: req.params.machineCode });
    if (!deleted) return res.status(404).json({ error: "Checksheet not found" });
    res.json({ message: "Checksheet deleted" });
  } catch (err) {
    console.error("❌ Error deleting checksheet:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Edit submission for a date
exports.editSubmissionForDate = async (req, res) => {
  try {
    const { machineCode, date, results } = req.body;
    console.log("📅 Editing submission for date:", date);

    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });

    let submission = sheet.submissions.find(
      (s) => s.date.toISOString().split("T")[0] === date
    );

    if (submission) {
      submission.results = results;
    } else {
      sheet.submissions.push({ date, results });
    }

    sheet.savedDate = new Date();
    await sheet.save();
    res.json(sheet);
  } catch (err) {
    console.error("❌ Error editing submission:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Export submissions in date range to Excel
exports.exportSubmissions = async (req, res) => {
  try {
    const { machineCode, from, to } = req.query;
    console.log(`📤 Exporting submissions for ${machineCode} from ${from} to ${to}`);

    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });

    const filtered = sheet.submissions.filter((s) => {
      const d = new Date(s.date);
      return d >= new Date(from) && d <= new Date(to);
    });

    const exportData = [];
    filtered.forEach((submission) => {
      submission.results.forEach((r) => {
        exportData.push({
          Date: submission.date.toISOString().split("T")[0],
          Sno: r.sno,
          PokeYokeCheck: sheet.checkItems.find((i) => i.sno === r.sno)?.pokeYokeCheck || "",
          TypeOfPokeYoke: sheet.checkItems.find((i) => i.sno === r.sno)?.typeOfPokeYoke || "",
          VerificationMethod: sheet.checkItems.find((i) => i.sno === r.sno)?.verificationMethod || "",
          OK_NG: r.okNg,
        });
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");

    const filePath = path.join(__dirname, `../exports/pokeyoke_${machineCode}.xlsx`);
    XLSX.writeFile(wb, filePath);

    res.download(filePath);
  } catch (err) {
    console.error("❌ Error exporting submissions:", err);
    res.status(500).json({ error: "Server error" });
  }
};
