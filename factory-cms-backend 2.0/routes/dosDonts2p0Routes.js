const express = require("express");
const router = express.Router();
const controller = require("../controllers/dosDonts2p0Controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads/dosdonts2p0");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"), false);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload-multiple", upload.array("images", 20), controller.uploadMultipleDosDonts);
router.get("/:machineCode", controller.getStepsByMachineCode);
router.delete("/step/:id", controller.deleteStepById);
router.delete("/all/:machineCode", controller.deleteAllByMachineCode);

module.exports = router;
