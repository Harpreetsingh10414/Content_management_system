const Product = require("../models/Product");
const Step = require("../models/Step");
const Tool = require("../models/Tool");
const Part = require("../models/Part");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Create a Product
exports.createProduct = async (req, res) => {
  console.log("[CREATE PRODUCT] Request received:", req.body);
  try {
    const product = await Product.create(req.body);
    console.log("[CREATE PRODUCT] Success:", product);
    res.status(201).json(product);
  } catch (err) {
    console.error("[CREATE PRODUCT] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  console.log("[GET PRODUCTS] Request received");
  try {
    const products = await Product.find();
    console.log("[GET PRODUCTS] Success: Found", products.length, "products");
    res.json(products);
  } catch (err) {
    console.error("[GET PRODUCTS] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a Step with File Upload
exports.createStep = async (req, res) => {
  console.log("[CREATE STEP] Request received:", req.body);
  upload.single("media")(req, res, async function (err) {
    if (err) {
      console.error("[CREATE STEP] File Upload Error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { productId, stepNumber, description, mediaType, toolsUsed, partsInvolved } = req.body;
      const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!mediaUrl) {
        console.warn("[CREATE STEP] No media file provided");
        return res.status(400).json({ error: "Media file is required" });
      }

      console.log("[CREATE STEP] Creating step with media:", mediaUrl);
      const step = await Step.create({
        productId,
        stepNumber,
        description,
        mediaType,
        mediaUrl,
        toolsUsed: toolsUsed ? toolsUsed.map(id => new mongoose.Types.ObjectId(id)) : [],
        partsInvolved: partsInvolved ? partsInvolved.map(id => new mongoose.Types.ObjectId(id)) : [],
      });

      console.log("[CREATE STEP] Success:", step);
      res.status(201).json(step);
    } catch (err) {
      console.error("[CREATE STEP] Error:", err);
      res.status(500).json({ error: err.message });
    }
  });
};

// Get Steps by Product ID
exports.getStepsByProduct = async (req, res) => {
  console.log("[GET STEPS] Request received for Product ID:", req.params.productId);
  try {
    const steps = await Step.find({ productId: req.params.productId }).populate("toolsUsed partsInvolved");
    console.log("[GET STEPS] Success: Found", steps.length, "steps");
    res.json(steps);
  } catch (err) {
    console.error("[GET STEPS] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a Tool
exports.createTool = async (req, res) => {
  console.log("[CREATE TOOL] Request received:", req.body);
  try {
    const tool = await Tool.create(req.body);
    console.log("[CREATE TOOL] Success:", tool);
    res.status(201).json(tool);
  } catch (err) {
    console.error("[CREATE TOOL] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a Part
exports.createPart = async (req, res) => {
  console.log("[CREATE PART] Request received:", req.body);
  try {
    const part = await Part.create(req.body);
    console.log("[CREATE PART] Success:", part);
    res.status(201).json(part);
  } catch (err) {
    console.error("[CREATE PART] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Parts
exports.getParts = async (req, res) => {
  console.log("[GET PARTS] Request received");
  try {
    const parts = await Part.find();
    console.log("[GET PARTS] Success: Found", parts.length, "parts");
    res.json(parts);
  } catch (err) {
    console.error("[GET PARTS] Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Tools
exports.getTools = async (req, res) => {
  console.log("[GET TOOLS] Request received");
  try {
    const tools = await Tool.find();
    console.log("[GET TOOLS] Success: Found", tools.length, "tools");
    res.json(tools);
  } catch (err) {
    console.error("[GET TOOLS] Error:", err);
    res.status(500).json({ error: err.message });
  }
};
