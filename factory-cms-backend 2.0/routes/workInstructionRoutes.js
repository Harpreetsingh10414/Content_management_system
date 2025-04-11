const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/workInstructionController");

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_instruction" + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Product
router.post("/products", controller.createProduct);
router.get("/products", controller.getProducts);

// Step
router.post("/steps", upload.single("media"), controller.createStep);
router.get("/steps/:productId", controller.getStepsByProduct);

// Tool
router.post("/tools", controller.createTool);
router.get("/tools", controller.getTools);

// Part
router.post("/parts", controller.createPart);
router.get("/parts", controller.getParts);

module.exports = router;
