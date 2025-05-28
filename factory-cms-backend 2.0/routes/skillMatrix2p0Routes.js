const express = require("express");
const router = express.Router();
const controller = require("../controllers/skillMatrix2p0Controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Directory setup
const uploadDir = path.join(__dirname, "../uploads/skillmatrix");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload", upload.array("images", 10), controller.uploadSkillMatrix);
router.get("/", controller.getAllSkillMatrices);
router.delete("/delete/name/:name", controller.deleteByName);
router.delete("/delete/machine/:machineCode", controller.deleteByMachineCode);

module.exports = router;
