const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/training folder exists
const uploadDir = path.join(__dirname, "../uploads/training");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PPT or PPTX files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload", upload.single("ppt"), trainingController.uploadTraining);
router.get("/", trainingController.getTrainings);
router.delete("/", trainingController.deleteTraining);

module.exports = router;
