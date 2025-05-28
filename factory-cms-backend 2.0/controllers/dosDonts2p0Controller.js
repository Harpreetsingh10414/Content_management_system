const DosDonts2p0 = require("../models/dosDonts2p0");
const fs = require("fs");
const path = require("path");

// Upload Do's & Don'ts image
exports.uploadDosDonts = async (req, res) => {
  try {
    console.log("Uploading image for Do's & Don'ts 2.0");

    const { name, machineCode } = req.body;

    if (!req.file || !name || !machineCode) {
      return res.status(400).json({ message: "Image, name, and machineCode are required." });
    }

    const newEntry = new DosDonts2p0({
      name,
      machineCode,
      imagePath: req.file.path,
    });

    await newEntry.save();
    res.status(201).json({ message: "Do's & Don'ts uploaded successfully", entry: newEntry });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

// Get all Do's & Don'ts
exports.getAllDosDonts = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const items = await DosDonts2p0.find(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch entries", error });
  }
};

// Delete by name
exports.deleteByName = async (req, res) => {
  try {
    const { name } = req.params;
    const entries = await DosDonts2p0.find({ name });

    if (!entries.length) {
      return res.status(404).json({ message: "No entries found with that name" });
    }

    for (const entry of entries) {
      fs.unlinkSync(path.join(__dirname, `../${entry.imagePath}`));
      await entry.deleteOne();
    }

    res.status(200).json({ message: "Entries deleted successfully by name" });
  } catch (error) {
    console.error("Delete by name error:", error);
    res.status(500).json({ message: "Failed to delete by name", error });
  }
};

// Delete by machineCode
exports.deleteByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const entries = await DosDonts2p0.find({ machineCode });

    if (!entries.length) {
      return res.status(404).json({ message: "No entries found with that machine code" });
    }

    for (const entry of entries) {
      fs.unlinkSync(path.join(__dirname, `../${entry.imagePath}`));
      await entry.deleteOne();
    }

    res.status(200).json({ message: "Entries deleted successfully by machineCode" });
  } catch (error) {
    console.error("Delete by machineCode error:", error);
    res.status(500).json({ message: "Failed to delete by machineCode", error });
  }
};
