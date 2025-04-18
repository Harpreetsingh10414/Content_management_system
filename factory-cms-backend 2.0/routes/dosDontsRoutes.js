const express = require("express");
const router = express.Router();
const dosDontsController = require("../controllers/dosDontsController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/dosdonts");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, jpg) allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload", upload.single("image"), dosDontsController.uploadImage);
router.get("/", dosDontsController.getAllImages);
router.get("/search", dosDontsController.searchImages);
router.get("/:id", dosDontsController.getImageById);
router.delete("/:id", dosDontsController.deleteImage);

module.exports = router;
