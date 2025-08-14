const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyPokeYokeController");

// Core flow (JSON-only, unchanged)
router.post("/create", controller.createChecksheet);
router.get("/:machineCode", controller.getChecksheetByMachine);
router.put("/edit/:machineCode", controller.editChecksheet);
router.delete("/delete/:machineCode", controller.deleteChecksheet);
router.put("/submission", controller.editSubmissionForDate);
router.get("/export", controller.exportSubmissions);

// Image upload helpers (NEW)
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/pokeyoke");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const fileFilter = (_req, file, cb) => {
  const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
  cb(ok ? null : new Error("Only PNG/JPG/JPEG allowed"), ok);
};
const upload = multer({ storage, fileFilter });

router.post("/upload", upload.single("photo"), controller.uploadPhoto);
router.post("/uploads", upload.array("photos"), controller.uploadPhotos);

module.exports = router;
