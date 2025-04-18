const DosDonts = require("../models/DosDonts");
const fs = require("fs");
const path = require("path");

// ✅ Upload an image
exports.uploadImage = async (req, res) => {
  try {
    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);

    const { title, language, createdBy, approvedBy, revision, machineCode } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!title || !language || !createdBy || !approvedBy || !revision || !machineCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newImage = new DosDonts({
      title,
      language,
      imagePath: req.file.path,
      createdBy,
      approvedBy,
      revision,
      machineCode,
    });

    await newImage.save();
    res.status(201).json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading image", error });
  }
};

// ✅ Get all images (optionally filter by machineCode)
exports.getAllImages = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const images = await DosDonts.find(filter);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error });
  }
};

// ✅ Search images by keyword (optionally filter by machineCode)
exports.searchImages = async (req, res) => {
  try {
    const { keyword, machineCode } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const filter = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { language: { $regex: keyword, $options: "i" } }
      ],
    };

    if (machineCode) {
      filter.machineCode = machineCode;
    }

    const images = await DosDonts.find(filter);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error searching images", error });
  }
};

// ✅ Get an image by ID
exports.getImageById = async (req, res) => {
  try {
    const image = await DosDonts.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error });
  }
};

// ✅ Delete an image
exports.deleteImage = async (req, res) => {
  try {
    const image = await DosDonts.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    fs.unlinkSync(path.join(__dirname, `../${image.imagePath}`));
    await image.deleteOne();
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error });
  }
};
