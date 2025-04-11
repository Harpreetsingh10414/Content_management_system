const Product = require("../models/Product");
const Step = require("../models/Step");
const Tool = require("../models/Tool");
const Part = require("../models/Part");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create Step
exports.createStep = async (req, res) => {
  try {
    const {
      productId, stepNumber, description,
      mediaType, toolsUsed, partsInvolved, machineCode
    } = req.body;

    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const step = new Step({
      productId, stepNumber, description, mediaType, mediaUrl,
      toolsUsed, partsInvolved, machineCode
    });

    await step.save();
    res.status(201).json(step);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Steps for a product and machine
exports.getStepsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { machineCode } = req.query;

    const steps = await Step.find({ productId, machineCode })
      .populate("toolsUsed")
      .populate("partsInvolved");

    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create Tool
exports.createTool = async (req, res) => {
  try {
    const tool = new Tool(req.body);
    await tool.save();
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create Part
exports.createPart = async (req, res) => {
  try {
    const part = new Part(req.body);
    await part.save();
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Tools
exports.getTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Parts
exports.getParts = async (req, res) => {
  try {
    const parts = await Part.find();
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
