const Drawing = require("../models/Drawing");
const fs = require("fs");
const path = require("path");

exports.uploadDrawing = async (req, res) => {
  try {
    const { machineCode, createdBy, approvedBy, date, revision } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Drawing file is required" });
    }

    if (!machineCode || !createdBy || !approvedBy || !date || !revision) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newDrawing = new Drawing({
      filePath: req.file.path,
      fileType: req.file.mimetype,
      machineCode,
      createdBy,
      approvedBy,
      date,
      revision
    });

    await newDrawing.save();
    res.status(201).json({ message: "Drawing uploaded successfully", drawing: newDrawing });
  } catch (error) {
    res.status(500).json({ message: "Error uploading drawing", error });
  }
};

exports.getAllDrawings = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const drawings = await Drawing.find(filter);
    res.status(200).json(drawings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drawings", error });
  }
};

exports.getDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) return res.status(404).json({ message: "Drawing not found" });
    res.status(200).json(drawing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drawing", error });
  }
};

exports.deleteDrawing = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) return res.status(404).json({ message: "Drawing not found" });

    fs.unlinkSync(path.join(__dirname, `../${drawing.filePath}`));
    await drawing.deleteOne();
    res.status(200).json({ message: "Drawing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drawing", error });
  }
};
