const Checksheet = require("../models/Checksheet");

// ✅ Create a new Checksheet
exports.createChecksheet = async (req, res) => {
  try {
    const checksheet = new Checksheet(req.body);
    await checksheet.save();
    res.status(201).json({ message: "Checksheet created successfully", checksheet });
  } catch (error) {
    res.status(500).json({ message: "Error creating checksheet", error });
  }
};

// ✅ Get all Checksheets
exports.getAllChecksheets = async (req, res) => {
  try {
    const checksheets = await Checksheet.find();
    res.status(200).json(checksheets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checksheets", error });
  }
};

// ✅ Get a Checksheet by ID
exports.getChecksheetById = async (req, res) => {
  try {
    const checksheet = await Checksheet.findById(req.params.id);
    if (!checksheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }
    res.status(200).json(checksheet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checksheet", error });
  }
};

// ✅ Add a new Check to an existing Checksheet (with file upload)
exports.addCheckToChecksheet = async (req, res) => {
  try {
    const { checksheetId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);

    if (!checksheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Check method image is required" });
    }

    const {
      serialNo,
      station,
      permissible,
      checkPoint,
      planTime,
      frequency,
      remark,
      actualTime,
      actionTaken
    } = req.body;

    const newCheck = {
      serialNo,
      checkMethod: req.file.path, // Store file path
      station,
      permissible,
      checkPoint,
      planTime,
      frequency,
      remark,
      actualTime,
      actionTaken
    };

    checksheet.checks.push(newCheck);
    await checksheet.save();
    
    res.status(201).json({ message: "Check added successfully", check: newCheck });
  } catch (error) {
    res.status(500).json({ message: "Error adding check", error });
  }
};

// ✅ Delete a specific Check from a Checksheet
exports.deleteCheckFromChecksheet = async (req, res) => {
  try {
    const { checksheetId, checkId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);

    if (!checksheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }

    checksheet.checks = checksheet.checks.filter(check => check._id.toString() !== checkId);
    await checksheet.save();
    
    res.status(200).json({ message: "Check deleted successfully", checksheet });
  } catch (error) {
    res.status(500).json({ message: "Error deleting check", error });
  }
};

// ✅ Delete an entire Checksheet
exports.deleteChecksheet = async (req, res) => {
  try {
    const checksheet = await Checksheet.findByIdAndDelete(req.params.id);
    if (!checksheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }
    res.status(200).json({ message: "Checksheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting checksheet", error });
  }
};

// ✅ Get all checks of a specific Checksheet
exports.getChecksByChecksheetId = async (req, res) => {
  try {
    const { checksheetId } = req.params;
    const checksheet = await Checksheet.findById(checksheetId);

    if (!checksheet) {
      return res.status(404).json({ message: "Checksheet not found" });
    }

    res.status(200).json({ checks: checksheet.checks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching checks", error });
  }
};
