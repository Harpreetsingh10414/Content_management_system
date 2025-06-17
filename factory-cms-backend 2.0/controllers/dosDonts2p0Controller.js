const DosDonts2p0 = require("../models/dosDonts2p0");
const fs = require("fs");
const path = require("path");

// Upload multiple steps
exports.uploadMultipleDosDonts = async (req, res) => {
  try {
    const { name, machineCode } = req.body;
    const stepNumbers = JSON.parse(req.body.stepNumbers || "[]");
    const descriptions = JSON.parse(req.body.descriptions || "[]");

    if (!name || !machineCode || stepNumbers.length === 0 || descriptions.length === 0 || !req.files.length) {
      return res.status(400).json({ message: "All fields and files are required." });
    }

    if (stepNumbers.length !== descriptions.length || stepNumbers.length !== req.files.length) {
      return res.status(400).json({ message: "Mismatch between stepNumbers, descriptions, or image count." });
    }

    const entries = stepNumbers.map((stepNumber, i) => ({
      name,
      machineCode,
      stepNumber,
      description: descriptions[i],
      imagePath: req.files[i].path,
    }));

    const saved = await DosDonts2p0.insertMany(entries);
    res.status(201).json({ message: "✅ Uploaded successfully", data: saved });

  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "❌ Error uploading Do's & Don'ts", error });
  }
};

// Get all steps for machineCode
exports.getStepsByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const steps = await DosDonts2p0.find({ machineCode }).sort({ stepNumber: 1 });
    res.status(200).json(steps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};

// Delete single step by ID
exports.deleteStepById = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await DosDonts2p0.findById(id);

    if (!step) return res.status(404).json({ message: "Step not found" });

    try {
      fs.unlinkSync(path.join(__dirname, `../${step.imagePath}`));
    } catch (e) {
      console.warn("Image not found to delete:", e.message);
    }

    await step.deleteOne();
    res.status(200).json({ message: "✅ Step deleted", step });

  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting step", error });
  }
};

// Delete all steps for a machineCode
exports.deleteAllByMachineCode = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const steps = await DosDonts2p0.find({ machineCode });

    if (!steps.length) return res.status(404).json({ message: "No steps found for this machineCode" });

    for (const step of steps) {
      try {
        fs.unlinkSync(path.join(__dirname, `../${step.imagePath}`));
      } catch (e) {
        console.warn("Image not found to delete:", e.message);
      }
      await step.deleteOne();
    }

    res.status(200).json({ message: `✅ Deleted ${steps.length} steps` });

  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting steps", error });
  }
};
