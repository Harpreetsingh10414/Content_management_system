const FourM = require("../models/FourM");

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

/* -------------------------- Add or Update 4M Sheet -------------------------- */
exports.addOrUpdateFourM = async (req, res) => {
  try {
    const { machineCode, man, machine, material, method } = req.body;

    if (!machineCode) {
      return res.status(400).json({ message: "machineCode is required" });
    }

    const date = getTodayDate();

    // Find if sheet already exists for this machine and date
    let sheet = await FourM.findOne({ machineCode, date });

    if (!sheet) {
      // Create new sheet
      sheet = new FourM({
        machineCode,
        date,
        entries: [],
      });
    }

    // Determine next serial number
    const sno = sheet.entries.length > 0 ? sheet.entries.length + 1 : 1;

    // Push new entry
    sheet.entries.push({
      sno,
      man,
      machine,
      material,
      method,
    });

    await sheet.save();

    res.status(200).json({
      message: "4M entry added successfully",
      sheet,
    });
  } catch (error) {
    console.error("Error adding/updating 4M data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* --------------------------- Get 4M Data by Machine --------------------------- */
exports.getFourMByMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    if (!machineCode) {
      return res.status(400).json({ message: "machineCode is required" });
    }

    const data = await FourM.find({ machineCode });

    res.status(200).json({
      message: "4M data fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching 4M data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ------------------------------ Delete by S.No ------------------------------ */
exports.deleteEntryBySno = async (req, res) => {
  try {
    const { machineCode, sno } = req.params;

    const sheet = await FourM.findOne({ machineCode });
    if (!sheet) {
      return res.status(404).json({ message: "No sheet found for this machine" });
    }

    // Filter out the entry
    const updatedEntries = sheet.entries.filter((entry) => entry.sno != sno);
    if (updatedEntries.length === sheet.entries.length) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Recalculate S.No sequence
    updatedEntries.forEach((entry, index) => (entry.sno = index + 1));

    sheet.entries = updatedEntries;
    await sheet.save();

    res.status(200).json({
      message: `Entry with S.No ${sno} deleted successfully`,
      sheet,
    });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
