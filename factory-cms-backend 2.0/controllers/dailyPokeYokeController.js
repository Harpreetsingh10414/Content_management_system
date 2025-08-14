const path = require("path");
const XLSX = require("xlsx");
const DailyPokeYokeChecksheet = require("../models/DailyPokeYokeChecksheet");

// ---------- Core flow (unchanged JSON APIs) ----------

// Create checksheet (JSON only)
exports.createChecksheet = async (req, res) => {
  try {
    console.log("📄 Creating Poke Yoke Checksheet (JSON flow)");
    const { documentName, machineCode, checkedBy, verifiedBy, checkItems } = req.body;

    // Be tolerant: allow string or array without forcing multipart
    const parsedItems = typeof checkItems === "string" ? JSON.parse(checkItems) : checkItems;

    const sheet = new DailyPokeYokeChecksheet({
      documentName,
      machineCode,
      checkedBy,
      verifiedBy,
      checkItems: parsedItems || [],
      // savedDate, revisedDate remain null initially
    });

    await sheet.save();
    return res.status(201).json(sheet);
  } catch (err) {
    console.error("❌ Error creating checksheet:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get by machineCode
exports.getChecksheetByMachine = async (req, res) => {
  try {
    console.log("📄 Fetch checksheet:", req.params.machineCode);
    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode: req.params.machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });
    return res.json(sheet);
  } catch (err) {
    console.error("❌ Error fetching checksheet:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Edit checksheet (JSON only). Any edit sets revisedDate.
exports.editChecksheet = async (req, res) => {
  try {
    console.log("✏ Edit checksheet:", req.params.machineCode);
    const payload = { ...req.body };
    if (typeof payload.checkItems === "string") {
      payload.checkItems = JSON.parse(payload.checkItems);
    }
    payload.revisedDate = new Date();

    const updated = await DailyPokeYokeChecksheet.findOneAndUpdate(
      { machineCode: req.params.machineCode },
      payload,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Checksheet not found" });
    return res.json(updated);
  } catch (err) {
    console.error("❌ Error editing checksheet:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete checksheet
exports.deleteChecksheet = async (req, res) => {
  try {
    console.log("🗑 Delete checksheet:", req.params.machineCode);
    const deleted = await DailyPokeYokeChecksheet.findOneAndDelete({ machineCode: req.params.machineCode });
    if (!deleted) return res.status(404).json({ error: "Checksheet not found" });
    return res.json({ message: "Checksheet deleted" });
  } catch (err) {
    console.error("❌ Error deleting checksheet:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Add/Edit submission for a date (JSON only). Also bumps savedDate.
exports.editSubmissionForDate = async (req, res) => {
  try {
    const { machineCode, date, results } = req.body;
    console.log("📅 Upsert submission:", machineCode, date);

    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });

    const iso = new Date(date).toISOString().slice(0, 10);
    const existing = sheet.submissions.find(s => s.date.toISOString().slice(0, 10) === iso);

    if (existing) {
      existing.results = results;
    } else {
      sheet.submissions.push({ date: iso, results });
    }

    sheet.savedDate = new Date();
    await sheet.save();
    return res.json(sheet);
  } catch (err) {
    console.error("❌ Error editing submission:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Export submissions in date range (unchanged)
exports.exportSubmissions = async (req, res) => {
  try {
    const { machineCode, from, to } = req.query;
    console.log(`📤 Export submissions: ${machineCode} ${from}..${to}`);

    const sheet = await DailyPokeYokeChecksheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ error: "Checksheet not found" });

    const fromD = new Date(from);
    const toD = new Date(to);
    const filtered = sheet.submissions.filter((s) => {
      const d = new Date(s.date);
      return d >= fromD && d <= toD;
    });

    const rows = [];
    filtered.forEach((sub) => {
      sub.results.forEach((r) => {
        const meta = sheet.checkItems.find((i) => i.sno === r.sno) || {};
        rows.push({
          Date: new Date(sub.date).toISOString().slice(0, 10),
          Sno: r.sno,
          PokeYokeCheck: meta.pokeYokeCheck || "",
          TypeOfPokeYoke: meta.typeOfPokeYoke || "",
          VerificationMethod: meta.verificationMethod || "",
          OK_NG: r.okNg,
        });
      });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");

    const filename = `pokeyoke_${machineCode}_${from}_${to}.xlsx`;
    const filePath = path.join(process.cwd(), "exports", filename);

    // ensure exports dir exists
    const fs = require("fs");
    const expDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(expDir)) fs.mkdirSync(expDir, { recursive: true });

    XLSX.writeFile(wb, filePath);
    return res.download(filePath, filename);
  } catch (err) {
    console.error("❌ Error exporting:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ---------- Image upload helper (NEW, does NOT change core flow) ----------

// Single file
exports.uploadPhoto = async (req, res) => {
  try {
    // multer adds req.file
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    return res.json({
      path: `uploads/pokeyoke/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Multiple files
exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const paths = req.files.map(f => `uploads/pokeyoke/${f.filename}`);
    return res.json({ paths });
  } catch (err) {
    console.error("❌ Uploads error:", err);
    return res.status(500).json({ error: err.message });
  }
};
