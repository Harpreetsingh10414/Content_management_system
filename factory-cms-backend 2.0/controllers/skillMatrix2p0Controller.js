const SkillMatrix = require("../models/SkillMatrix2p0");
const fs = require("fs");
const path = require("path");

// ✅ Upload one or more skill matrix images
exports.uploadSkillMatrix = async (req, res) => {
  try {
    const { name, machineCode } = req.body;
    console.log("Received name:", name);
    console.log("Received machineCode:", machineCode);
    console.log("Received files:", req.files);

    if (!name || !machineCode || !req.files?.length) {
      return res.status(400).json({ message: "All fields and at least one image are required." });
    }

    const images = [];

    for (const file of req.files) {
      const newSkillMatrix = new SkillMatrix({
        name,
        machineCode,
        imagePath: file.path,
      });

      const saved = await newSkillMatrix.save();
      images.push(saved);
    }

    res.status(201).json({ message: "Skill matrix images uploaded successfully.", data: images });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to upload skill matrix.", error });
  }
};

// ✅ Get all skill matrix images (optionally filter by machineCode)
exports.getAllSkillMatrices = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const matrices = await SkillMatrix.find(filter);
    res.status(200).json(matrices);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch skill matrix images.", error });
  }
};

// ✅ Delete by name
exports.deleteByName = async (req, res) => {
  try {
    const { name } = req.params;
    const records = await SkillMatrix.find({ name });

    if (!records.length) {
      return res.status(404).json({ message: "No records found with the given name." });
    }

    for (const record of records) {
      fs.unlinkSync(path.join(__dirname, `../${record.imagePath}`));
      await record.deleteOne();
    }

    res.status(200).json({ message: "Skill matrix entries deleted successfully by name." });
  } catch (error) {
    console.error("Delete by Name Error:", error);
    res.status(500).json({ message: "Failed to delete skill matrix by name.", error });
  }
};

// ✅ Delete by machineCode
exports.deleteByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const records = await SkillMatrix.find({ machineCode });

    if (!records.length) {
      return res.status(404).json({ message: "No records found for the given machine code." });
    }

    for (const record of records) {
      fs.unlinkSync(path.join(__dirname, `../${record.imagePath}`));
      await record.deleteOne();
    }

    res.status(200).json({ message: "Skill matrix entries deleted successfully by machine code." });
  } catch (error) {
    console.error("Delete by MachineCode Error:", error);
    res.status(500).json({ message: "Failed to delete skill matrix by machine code.", error });
  }
};
