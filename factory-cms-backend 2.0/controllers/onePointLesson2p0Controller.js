const OnePointLesson2p0 = require("../models/OnePointLesson2p0");
const path = require("path");
const fs = require("fs");

// Upload multiple steps
exports.uploadLessonSteps = async (req, res) => {
  try {
    const { name, machineCode, descriptions, stepNumbers } = req.body;
    const files = req.files;

    if (!name || !machineCode || !files || files.length === 0) {
      return res.status(400).json({ message: "All fields and files are required" });
    }

    const steps = files.map((file, index) => ({
      stepNumber: Number(stepNumbers[index]),
      imagePath: file.path,
      description: descriptions[index]
    }));

    const newLesson = new OnePointLesson2p0({
      name,
      machineCode,
      steps
    });

    await newLesson.save();
    res.status(201).json({ message: "One Point Lesson created", data: newLesson });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload lesson", error: err });
  }
};

// Get lessons by machine (optional filter)
exports.getLessons = async (req, res) => {
  try {
    const filter = req.query.machineCode ? { machineCode: req.query.machineCode } : {};
    const lessons = await OnePointLesson2p0.find(filter);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Failed to get lessons", error });
  }
};

// Delete by name or machineCode
exports.deleteLessons = async (req, res) => {
  try {
    const { name, machineCode } = req.body;

    if (!name && !machineCode) {
      return res.status(400).json({ message: "Provide name or machineCode" });
    }

    const filter = {};
    if (name) filter.name = name;
    if (machineCode) filter.machineCode = machineCode;

    const lessons = await OnePointLesson2p0.find(filter);
    if (!lessons.length) return res.status(404).json({ message: "No lessons found" });

    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        fs.unlinkSync(path.join(__dirname, `../${step.imagePath}`));
      }
      await lesson.deleteOne();
    }

    res.status(200).json({ message: "Lessons deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err });
  }
};

// Handles /upload route
exports.uploadLesson = async (req, res) => {
  try {
    const { name, machineCode, stepNumbers, descriptions } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one step image is required" });
    }

    if (!name || !machineCode) {
      return res.status(400).json({ message: "Name and machineCode are required" });
    }

    const steps = req.files.map((file, index) => ({
      stepNumber: Array.isArray(stepNumbers) ? Number(stepNumbers[index]) : Number(stepNumbers),
      description: Array.isArray(descriptions) ? descriptions[index] : descriptions,
      imagePath: file.path,
    }));

    const newLesson = new OnePointLesson2p0({
      name,
      machineCode,
      steps,
    });

    await newLesson.save();
    res.status(201).json({ message: "Lesson uploaded", data: newLesson });
  } catch (error) {
    console.error("Error uploading lesson:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};



// ✅ DELETE a single lesson by ID
exports.deleteLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Deleting OnePointLesson2p0 with ID:", id);

    const lesson = await OnePointLesson2p0.findById(id);
    if (!lesson) {
      return res.status(404).json({ message: "❌ Lesson not found" });
    }

    // Delete step image files
    for (const step of lesson.steps) {
      const filePath = path.join(__dirname, `../${step.imagePath}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await lesson.deleteOne();
    res.status(200).json({ message: "✅ Lesson deleted successfully", lesson });
  } catch (error) {
    console.error("❌ Error deleting lesson by ID:", error);
    res.status(500).json({ message: "Error deleting lesson", error });
  }
};

// ✅ DELETE all lessons for a specific machineCode
exports.deleteAllLessonsForMachine = async (req, res) => {
  try {
    const { machineCode } = req.params;
    console.log("🗑️ Deleting all lessons for machineCode:", machineCode);

    const lessons = await OnePointLesson2p0.find({ machineCode });
    if (!lessons.length) {
      return res.status(404).json({ message: "❌ No lessons found for this machineCode" });
    }

    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const filePath = path.join(__dirname, `../${step.imagePath}`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await lesson.deleteOne();
    }

    res.status(200).json({ message: `✅ Deleted ${lessons.length} lessons for machineCode ${machineCode}` });
  } catch (error) {
    console.error("❌ Error deleting all lessons:", error);
    res.status(500).json({ message: "Error deleting all lessons", error });
  }
};
