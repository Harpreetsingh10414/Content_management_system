const express = require("express");
const router = express.Router();
const controller = require("../controllers/onePointLesson2p0Controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const uploadDir = path.join(__dirname, "../uploads/onepointlesson2p0");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, JPG, PNG allowed"), false);
};
const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload", upload.single("image"), controller.uploadLesson);
router.get("/", controller.getLessons);
router.delete("/:id", controller.deleteLesson);

// ✅ Delete by name and machineCode
router.delete("/deleteByNameAndMachine", controller.deleteLessonByNameAndMachine);

module.exports = router;
