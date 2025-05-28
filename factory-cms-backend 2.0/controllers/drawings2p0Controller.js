const Drawings2p0 = require("../models/drawings2p0");
const fs = require("fs");
const path = require("path");

// ✅ Upload a drawing image
exports.uploadDrawing = async (req, res) => {
  try {
    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);

    const { name, machineCode } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!name || !machineCode) {
      return res.status(400).json({ message: "Name and machineCode are required" });
    }

    const newDrawing = new Drawings2p0({
      name,
      machineCode,
      imagePath: req.file.path,
    });

    await newDrawing.save();
    res.status(201).json({ message: "Drawing uploaded successfully", drawing: newDrawing });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading drawing", error });
  }
};

// ✅ Get all drawings or filter by machineCode
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

// ✅ Delete drawing(s) by name
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

// ✅ Delete all drawings by machineCode
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
