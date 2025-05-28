const Documents2p0 = require("../models/documents2p0");
const fs = require("fs");
const path = require("path");

// Upload document image
exports.uploadDocument = async (req, res) => {
  try {
    console.log("Uploading document:", req.file);
    const { documentName, machineCode } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!documentName || !machineCode) {
      return res.status(400).json({ message: "documentName and machineCode are required" });
    }

    const newDoc = new Documents2p0({
      documentName,
      machineCode,
      imagePath: req.file.path
    });

    await newDoc.save();
    console.log("Document saved:", newDoc);
    res.status(201).json({ message: "Document uploaded successfully", document: newDoc });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload document", error });
  }
};

// Get all documents (optionally by machine)
exports.getDocuments = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const docs = await Documents2p0.find(filter);
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents", error });
  }
};

// Delete by document name and machineCode
exports.deleteDocument = async (req, res) => {
  try {
    const { documentName, machineCode } = req.body;

    if (!documentName || !machineCode) {
      return res.status(400).json({ message: "documentName and machineCode are required" });
    }

    const doc = await Documents2p0.findOne({ documentName, machineCode });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    fs.unlinkSync(path.join(__dirname, `../${doc.imagePath}`));
    await doc.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete document", error });
  }
};
