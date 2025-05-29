const Training = require("../models/Training");
const fs = require("fs");
const path = require("path");

// Upload PPT
exports.uploadTraining = async (req, res) => {
  try {
    console.log("Received File:", req.file);
    console.log("Body:", req.body);

    const { trainingName, machineCode } = req.body;

    if (!req.file) return res.status(400).json({ message: "PPT file is required" });
    if (!trainingName || !machineCode) return res.status(400).json({ message: "All fields are required" });

    const newTraining = new Training({
      trainingName,
      machineCode,
      filePath: req.file.path,
    });

    await newTraining.save();
    res.status(201).json({ message: "Training uploaded", training: newTraining });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading training", error: err });
  }
};

// Get all trainings (optionally filter by machineCode)
exports.getTrainings = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const trainings = await Training.find(filter);
    res.status(200).json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trainings", error: err });
  }
};

// Delete by name or machineCode
exports.deleteTraining = async (req, res) => {
  try {
    const { trainingName, machineCode } = req.body;

    if (!trainingName && !machineCode) {
      return res.status(400).json({ message: "trainingName or machineCode is required" });
    }

    const filter = {};
    if (trainingName) filter.trainingName = trainingName;
    if (machineCode) filter.machineCode = machineCode;

    const trainings = await Training.find(filter);
    if (!trainings.length) return res.status(404).json({ message: "No training found" });

    for (const item of trainings) {
      fs.unlinkSync(path.join(__dirname, `../${item.filePath}`));
      await item.deleteOne();
    }

    res.status(200).json({ message: "Training(s) deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting training(s)", error: err });
  }
};
