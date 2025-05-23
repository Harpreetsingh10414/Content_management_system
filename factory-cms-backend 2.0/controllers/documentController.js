const Document = require("../models/Document");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");

// ➤ Upload a new document
// ➤ Upload a new document (PDF or image)
exports.uploadDocument = async (req, res) => {
  try {
    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { title, description, language, uploadedBy, machineCode } = req.body;
    if (!machineCode) return res.status(400).json({ error: "machineCode is required" });

    const filePath = `/uploads/documents/${req.file.filename}`;
    const mimeType = req.file.mimetype;

    let keywords = [];

    if (mimeType === "application/pdf") {
      // Extract text from PDF
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;
      keywords = extractedText.split(/\s+/).slice(0, 50).map(word => word.toLowerCase());
    } else if (
      mimeType === "image/png" ||
      mimeType === "image/jpeg" ||
      mimeType === "image/jpg"
    ) {
      // Add default keywords for images (or leave empty)
      keywords = ["image", "document"];
    } else {
      return res.status(400).json({ error: "Unsupported file type. Only PDF or image allowed." });
    }

    const newDocument = new Document({
      title,
      description,
      filePath,
      language,
      machineCode,
      keywords,
      uploadedBy,
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (err) {
    console.error("Error uploading document:", err);
    res.status(500).json({ error: err.message });
  }
};


// ➤ Get all documents (optionally filter by machineCode)
exports.getAllDocuments = async (req, res) => {
  try {
    const { machineCode } = req.query;
    const filter = machineCode ? { machineCode } : {};
    const documents = await Document.find(filter);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➤ Search documents by keyword and optionally machineCode
exports.searchDocuments = async (req, res) => {
  try {
    const { keyword, machineCode } = req.query;
    if (!keyword) return res.status(400).json({ error: "Keyword is required" });

    const filter = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { keywords: { $in: [keyword.toLowerCase()] } },
      ],
    };

    if (machineCode) filter.machineCode = machineCode;

    const documents = await Document.find(filter);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error searching documents:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➤ Get a specific document
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });

    res.status(200).json(document);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➤ Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document not found" });

    fs.unlinkSync(path.join(__dirname, `../${document.filePath}`));
    await document.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: err.message });
  }
};
