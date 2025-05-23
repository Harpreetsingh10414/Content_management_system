const express = require("express");
const router = express.Router();
const controller = require("../controllers/workInstruction2p0Controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directory if not exists
const uploadDir = path.join(__dirname, "../uploads/workinstruction2p0");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, and JPEG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/uploadMultiple", upload.array("images", 20), controller.uploadSteps);
router.get("/:machineCode", controller.getStepsByMachineCode);
router.delete("/step/:id", controller.deleteStepById);
router.delete("/all/:machineCode", controller.deleteAllStepsForMachine);

module.exports = router;
