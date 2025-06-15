const OnePointLesson = require("../models/OnePointLesson2p0");
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

    const newLesson = new OnePointLesson({
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
    const lessons = await OnePointLesson.find(filter);
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

    const lessons = await OnePointLesson.find(filter);
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