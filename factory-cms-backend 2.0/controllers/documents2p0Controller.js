const Documents2p0 = require("../models/documents2p0");
const fs = require("fs");
const path = require("path");

// ✅ Upload multiple document images
exports.uploadMultipleDocuments = async (req, res) => {
  try {
    const { documentName, machineCode } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (!documentName || !machineCode) {
      return res.status(400).json({ message: "documentName and machineCode are required" });
    }

    const savedDocs = [];

    for (const file of files) {
      const newDoc = new Documents2p0({
        documentName,
        machineCode,
        imagePath: file.path,
      });

      await newDoc.save();
      savedDocs.push(newDoc);
    }

    res.status(201).json({
      message: "Documents uploaded successfully",
      documents: savedDocs,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload documents", error });
  }
};

// ✅ Get documents (optionally filtered by machineCode)
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

// ✅ Delete by documentName + machineCode (all matching)
exports.deleteDocument = async (req, res) => {
  try {
    const { documentName, machineCode } = req.body;

    if (!documentName || !machineCode) {
      return res.status(400).json({ message: "documentName and machineCode are required" });
    }

    const docs = await Documents2p0.find({ documentName, machineCode });

    if (!docs.length) {
      return res.status(404).json({ message: "No matching documents found" });
    }

    for (const doc of docs) {
      fs.unlinkSync(path.join(__dirname, `../${doc.imagePath}`));
      await doc.deleteOne();
    }

    res.status(200).json({ message: "Matching documents deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete document", error });
  }
};

// ✅ Delete by MongoDB ID
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Documents2p0.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Document not found" });
    }

    const fullPath = path.join(__dirname, `../${record.imagePath}`);
    
    // Check if file exists before deleting
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      console.warn("File not found, skipping delete:", fullPath);
    }

    await record.deleteOne();

    res.status(200).json({ message: "Document deleted successfully by ID" });
  } catch (error) {
    console.error("Delete by ID Error:", error);
    res.status(500).json({ message: "Failed to delete document by ID", error });
  }
};

