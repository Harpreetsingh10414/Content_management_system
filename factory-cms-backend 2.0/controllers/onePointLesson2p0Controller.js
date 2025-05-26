const OnePointLesson2p0 = require("../models/OnePointLesson2p0");
const path = require("path");
const fs = require("fs");

// Upload lesson
exports.uploadLesson = async (req, res) => {
  try {
    console.log("Uploading One Point Lesson 2.0");
    const { name, machineCode } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });
    if (!name || !machineCode) return res.status(400).json({ message: "Name and machineCode are required" });

    const newLesson = new OnePointLesson2p0({
      name,
      machineCode,
      imagePath: req.file.path,
    });

    await newLesson.save();
    console.log("Upload successful:", newLesson);
    res.status(201).json({ message: "Lesson uploaded", data: newLesson });
  } catch (error) {
    console.error("Error uploading lesson:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

// Get lessons (optionally filtered)
exports.getLessons = async (req, res) => {
  try {
    const filter = req.query.machineCode ? { machineCode: req.query.machineCode } : {};
    const lessons = await OnePointLesson2p0.find(filter);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lessons", error });
  }
};

// Delete by ID
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await OnePointLesson2p0.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    fs.unlinkSync(path.join(__dirname, `../${lesson.imagePath}`));
    await lesson.deleteOne();
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lesson", error });
  }
};

// ✅ Delete by name and machineCode
exports.deleteLessonByNameAndMachine = async (req, res) => {
  try {
    const { name, machineCode } = req.body;
    console.log("Delete request received:", name, machineCode);

    const lesson = await OnePointLesson2p0.findOne({ name, machineCode });
    if (!lesson) return res.status(404).json({ message: "Lesson not found with given name and machineCode" });

    fs.unlinkSync(path.join(__dirname, `../${lesson.imagePath}`));
    await lesson.deleteOne();

    console.log("Lesson deleted:", lesson._id);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting by name and machine:", error);
    res.status(500).json({ message: "Error deleting lesson", error });
  }
};
