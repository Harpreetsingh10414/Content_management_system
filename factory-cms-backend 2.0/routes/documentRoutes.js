const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const documentController = require("../controllers/documentController");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG, and JPEG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/", (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific error
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors, like file type
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, documentController.uploadDocument);

router.get("/", documentController.getAllDocuments);
router.get("/search", documentController.searchDocuments);
router.get("/:id", documentController.getDocumentById);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
