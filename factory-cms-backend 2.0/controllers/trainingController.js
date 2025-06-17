const Training = require("../models/Training");
const fs = require("fs");
const path = require("path");

// Upload PPT and/or images
exports.uploadTraining = async (req, res) => {
  try {
    const { trainingName, machineCode } = req.body;

    if (!trainingName || !machineCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let pptPath = null;
    let imagePaths = [];

    if (req.files["ppt"] && req.files["ppt"][0]) {
      pptPath = req.files["ppt"][0].path;
    }

    if (req.files["images"]) {
      imagePaths = req.files["images"].map(file => file.path);
    }

    if (!pptPath && imagePaths.length === 0) {
      return res.status(400).json({ message: "At least one file is required (ppt or images)" });
    }

    const newTraining = new Training({
      trainingName,
      machineCode,
      pptPath,
      imagePaths
    });

    await newTraining.save();
    res.status(201).json({ message: "Training uploaded", training: newTraining });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading training", error: err });
  }
};

// Get trainings (optionally filtered)
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

// Delete by trainingName or machineCode
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
      if (item.pptPath) fs.unlinkSync(path.join(__dirname, `../${item.pptPath}`));
      if (item.imagePaths) {
        item.imagePaths.forEach(imgPath => {
          fs.unlinkSync(path.join(__dirname, `../${imgPath}`));
        });
      }
      await item.deleteOne();
    }

    res.status(200).json({ message: "Training(s) deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting training(s)", error: err });
  }
};


// ✅ Safe delete by ID
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Training.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Training record not found" });
    }

    // Delete PPT file if it exists
    if (record.pptPath) {
      const pptFullPath = path.join(__dirname, `../${record.pptPath}`);
      if (fs.existsSync(pptFullPath)) {
        fs.unlinkSync(pptFullPath);
      } else {
        console.warn("PPT not found, skipping:", pptFullPath);
      }
    }

    // Delete each image safely
    if (Array.isArray(record.imagePaths)) {
      for (const imgPath of record.imagePaths) {
        const imgFullPath = path.join(__dirname, `../${imgPath}`);
        if (fs.existsSync(imgFullPath)) {
          fs.unlinkSync(imgFullPath);
        } else {
          console.warn("Image not found, skipping:", imgFullPath);
        }
      }
    }

    await record.deleteOne();
    res.status(200).json({ message: "Training record deleted successfully by ID" });
  } catch (err) {
    console.error("Delete by ID Error:", err);
    res.status(500).json({ message: "Failed to delete training by ID", error: err });
  }
};
