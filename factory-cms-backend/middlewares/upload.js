const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directories
const uploadsDir = path.join(__dirname, "../uploads");
const imagesDir = path.join(uploadsDir, "images");
const pdfsDir = path.join(uploadsDir, "pdfs");

// Ensure that the necessary directories exist
[uploadsDir, imagesDir, pdfsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;

    // Check if file is an image or PDF
    if (file.mimetype.startsWith("image/")) {
      uploadPath = imagesDir;
    } else if (file.mimetype === "application/pdf") {
      uploadPath = pdfsDir;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File Filter to Accept Only PDFs and Images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, PNG, and JPG files are allowed!"), false);
  }
};

// Multer Upload Instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;
