const express = require("express");
const router = express.Router();
const drawingController = require("../controllers/drawingController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/drawings directory exists
const uploadDir = path.join(__dirname, "../uploads/drawings");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Custom storage for drawings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter for drawings
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG, and JPEG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload", upload.single("drawing"), drawingController.uploadDrawing);
router.get("/", drawingController.getAllDrawings);
router.get("/:id", drawingController.getDrawingById);
router.delete("/:id", drawingController.deleteDrawing);

module.exports = router;
