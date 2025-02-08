const OnePointLesson = require("../models/OnePointLesson");
const multer = require("multer");

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Upload a new One Point Lesson
exports.createOnePointLesson = (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { title, description, language, createdBy, approvedBy } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!imageUrl) return res.status(400).json({ error: "Image file is required" });

      const lesson = await OnePointLesson.create({
        title,
        description,
        language,
        imageUrl,
        createdBy,
        approvedBy,
      });

      res.status(201).json(lesson);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// ✅ Get All One Point Lessons
exports.getAllOnePointLessons = async (req, res) => {
  try {
    const lessons = await OnePointLesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get One Point Lessons by Language
exports.getLessonsByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    const lessons = await OnePointLesson.find({ language });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a One Point Lesson (Approval Status)
exports.updateOnePointLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, approvedBy } = req.body;
    const updateData = { approvalStatus };

    if (approvalStatus === "Approved") {
      updateData.approvedBy = approvedBy;
      updateData.approvedAt = new Date();
    }

    const updatedLesson = await OnePointLesson.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a One Point Lesson
exports.deleteOnePointLesson = async (req, res) => {
  try {
    const { id } = req.params;
    await OnePointLesson.findByIdAndDelete(id);
    res.json({ message: "One Point Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
