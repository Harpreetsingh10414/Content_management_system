const WorkInstruction2p0 = require("../models/WorkInstruction2p0");

// Upload multiple steps with images
exports.uploadSteps = async (req, res) => {
  try {
    console.log("🟢 Received Body:", req.body);
    console.log("🟢 Received Files:", req.files);

    const { machineCode } = req.body;
    const stepNumbers = JSON.parse(req.body.stepNumbers || "[]");
    const descriptions = JSON.parse(req.body.descriptions || "[]");

    if (!machineCode || stepNumbers.length === 0 || descriptions.length === 0) {
      return res.status(400).json({ message: "❌ machineCode, stepNumbers, and descriptions are required." });
    }

    if (stepNumbers.length !== descriptions.length || stepNumbers.length !== req.files.length) {
      return res.status(400).json({ message: "❌ Mismatch between steps, descriptions, or image count." });
    }

    const steps = stepNumbers.map((stepNumber, i) => ({
      machineCode,
      stepNumber,
      description: descriptions[i],
      imagePath: req.files[i].path,
    }));

    const savedSteps = await WorkInstruction2p0.insertMany(steps);
    console.log("✅ Saved Steps:", savedSteps);
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
    console.log("🔍 Fetching steps for machineCode:", machineCode);
    const steps = await WorkInstruction2p0.find({ machineCode }).sort({ stepNumber: 1 });
    res.status(200).json(steps);
  } catch (error) {
    console.error("❌ Error fetching steps:", error);
    res.status(500).json({ message: "Error fetching steps", error });
  }
};

// Delete a single step by ID
exports.deleteStepById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Deleting step with ID:", id);
    const deleted = await WorkInstruction2p0.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ Step not found" });
    }
    res.status(200).json({ message: "✅ Step deleted successfully", step: deleted });
  } catch (error) {
    console.error("❌ Error deleting step:", error);
    res.status(500).json({ message: "Error deleting step", error });
  }
};

// Delete all steps for a machine
exports.deleteAllStepsForMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    console.log("🗑️ Deleting all steps for machineCode:", machineCode);
    const result = await WorkInstruction2p0.deleteMany({ machineCode });
    res.status(200).json({ message: `✅ Deleted ${result.deletedCount} steps for machineCode ${machineCode}` });
  } catch (error) {
    console.error("❌ Error deleting steps:", error);
    res.status(500).json({ message: "Error deleting all steps", error });
  }
};
