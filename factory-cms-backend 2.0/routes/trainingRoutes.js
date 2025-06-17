const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads/training");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const allowedTypes = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/jpg",
  "image/png"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PPT/PPTX and JPEG/PNG images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post(
  "/upload",
  upload.fields([
    { name: "ppt", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  trainingController.uploadTraining
);

router.get("/", trainingController.getTrainings);
router.delete("/", trainingController.deleteTraining);
router.delete("/delete/id/:id", trainingController.deleteById);


module.exports = router;
