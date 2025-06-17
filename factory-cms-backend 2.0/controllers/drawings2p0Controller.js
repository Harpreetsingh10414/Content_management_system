const Drawings2p0 = require("../models/drawings2p0");
const fs = require("fs");
const path = require("path");

// ✅ Upload Multiple Drawing Images
exports.uploadMultipleDrawings = async (req, res) => {
  try {
    console.log("Uploading multiple drawing images");

    const { name, machineCode } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (!name || !machineCode) {
      return res.status(400).json({ message: "Name and machineCode are required" });
    }

    const entries = await Promise.all(
      files.map((file) => {
        const newEntry = new Drawings2p0({
          name,
          machineCode,
          imagePath: file.path,
        });
        return newEntry.save();
      })
    );

    res.status(201).json({ message: "Drawings uploaded successfully", entries });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading drawings", error });
  }
};

// ✅ Get All Drawings (with optional filter)
exports.getAllDrawings = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const drawings = await Drawings2p0.find(filter);
    res.status(200).json(drawings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drawings", error });
  }
};

// ✅ Delete Drawings by Name
exports.deleteByName = async (req, res) => {
  try {
    const { name } = req.params;
    const drawings = await Drawings2p0.find({ name });

    if (!drawings.length) {
      return res.status(404).json({ message: "No drawings found with the given name" });
    }

    for (const drawing of drawings) {
      fs.unlinkSync(path.join(__dirname, `../${drawing.imagePath}`));
      await drawing.deleteOne();
    }

    res.status(200).json({ message: `Drawings with name '${name}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drawings by name", error });
  }
};

// ✅ Delete Drawings by Machine Code
exports.deleteByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const drawings = await Drawings2p0.find({ machineCode });

    if (!drawings.length) {
      return res.status(404).json({ message: "No drawings found for the given machineCode" });
    }

    for (const drawing of drawings) {
      fs.unlinkSync(path.join(__dirname, `../${drawing.imagePath}`));
      await drawing.deleteOne();
    }

    res.status(200).json({ message: `Drawings for machineCode '${machineCode}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drawings by machineCode", error });
  }
};
