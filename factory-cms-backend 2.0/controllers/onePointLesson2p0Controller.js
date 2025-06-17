const OnePointLesson2p0 = require("../models/OnePointLesson2p0");
const fs = require("fs");
const path = require("path");

// Upload multiple steps
exports.uploadSteps = async (req, res) => {
  try {
    const { lessonName, machineCode } = req.body;
    const stepNumbers = JSON.parse(req.body.stepNumbers || "[]");
    const descriptions = JSON.parse(req.body.descriptions || "[]");

    if (!lessonName || !machineCode || !req.files) {
      return res.status(400).json({ message: "❌ lessonName, machineCode, and images are required." });
    }

    if (stepNumbers.length !== descriptions.length || stepNumbers.length !== req.files.length) {
      return res.status(400).json({ message: "❌ Mismatch between stepNumbers, descriptions, or image count." });
    }

    const steps = stepNumbers.map((stepNumber, i) => ({
      lessonName,
      machineCode,
      stepNumber,
      description: descriptions[i],
      imagePath: req.files[i].path
    }));

    const savedSteps = await OnePointLesson2p0.insertMany(steps);
    res.status(201).json({ message: "✅ Steps uploaded successfully", steps: savedSteps });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "❌ Error uploading steps", error });
  }
};

// Get all steps for a machine
exports.getStepsByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const steps = await OnePointLesson2p0.find({ machineCode }).sort({ stepNumber: 1 });
    res.status(200).json(steps);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching steps", error });
  }
};

// Delete a single step by ID
exports.deleteStepById = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await OnePointLesson2p0.findById(id);
    if (!step) return res.status(404).json({ message: "❌ Step not found" });

    fs.unlinkSync(path.join(__dirname, `../${step.imagePath}`));
    await step.deleteOne();
    res.status(200).json({ message: "✅ Step deleted", step });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting step", error });
  }
};

// Delete all steps for a machine
exports.deleteAllStepsForMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const steps = await OnePointLesson2p0.find({ machineCode });

    for (const step of steps) {
      fs.unlinkSync(path.join(__dirname, `../${step.imagePath}`));
    }

    const result = await OnePointLesson2p0.deleteMany({ machineCode });
    res.status(200).json({ message: `✅ Deleted ${result.deletedCount} steps for machineCode ${machineCode}` });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting all steps", error });
  }
};
