const OnePointLesson2p0 = require("../models/OnePointLesson2p0");
const fs = require("fs");
const path = require("path");

// Upload multiple steps
// Upload multiple OPL steps
exports.uploadSteps = async (req, res) => {
  try {
    console.log("🟢 Received Body:", req.body);
    console.log("🟢 Received Files:", req.files);

    const { lessonName, machineCode } = req.body;
    const descriptions = JSON.parse(req.body.descriptions || "[]");

    if (!lessonName || !machineCode || descriptions.length === 0) {
      return res.status(400).json({ message: "❌ lessonName, machineCode, and descriptions are required." });
    }

    if (descriptions.length !== req.files.length) {
      return res.status(400).json({ message: "❌ Descriptions count and image count must match." });
    }

    const steps = descriptions.map((description, i) => ({
      lessonName,
      machineCode,
      stepNumber: i + 1,
      description,
      imagePath: req.files[i].path,
    }));

    const savedSteps = await OnePointLesson2p0.insertMany(steps);
    console.log("✅ Saved OPL Steps:", savedSteps);

    res.status(201).json({ message: "✅ Lesson uploaded successfully", steps: savedSteps });
  } catch (error) {
    console.error("❌ Error uploading lesson:", error);
    res.status(500).json({ message: "❌ Error uploading lesson", error });
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
// Delete a single step by ID
exports.deleteStepById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Deleting OPL step with ID:", id);
    console.log("🔍 ID from params:", id);

    const step = await OnePointLesson2p0.findById(id);
    if (!step) return res.status(404).json({ message: "Step not found" });

    // Delete file from disk
    const fullPath = path.resolve(step.imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await step.deleteOne();

    res.status(200).json({ message: "✅ Step deleted successfully", step });
  } catch (error) {
    console.error("❌ Error deleting step:", error);
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
