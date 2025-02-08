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
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Step with File Upload
exports.createStep = async (req, res) => {
  upload.single("media")(req, res, async function (err) {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { productId, stepNumber, description, mediaType, toolsUsed, partsInvolved } = req.body;
      const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!mediaUrl) return res.status(400).json({ error: "Media file is required" });

      const step = await Step.create({
        productId,
        stepNumber,
        description,
        mediaType,
        mediaUrl,
        toolsUsed: toolsUsed ? toolsUsed.map(id => new mongoose.Types.ObjectId(id)) : [],
        partsInvolved: partsInvolved ? partsInvolved.map(id => new mongoose.Types.ObjectId(id)) : [],
      });

      res.status(201).json(step);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Get Steps by Product ID
exports.getStepsByProduct = async (req, res) => {
  try {
    const steps = await Step.find({ productId: req.params.productId }).populate("toolsUsed partsInvolved");
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Tool
exports.createTool = async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Part
exports.createPart = async (req, res) => {
  try {
    const part = await Part.create(req.body);
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Parts
exports.getParts = async (req, res) => {
  try {
    const parts = await Part.find();
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tools
exports.getTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


