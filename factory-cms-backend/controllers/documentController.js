const Document = require("../models/Document");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");

// ➤ Upload a new document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { title, description, language, uploadedBy } = req.body;
    const filePath = `/uploads/documents/${req.file.filename}`;

    // Extract text from PDF for search indexing
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    // Generate keywords from extracted text
    const keywords = extractedText.split(/\s+/).slice(0, 50); // First 50 words as keywords

    const newDocument = new Document({
      title,
      description,
      filePath,
      language,
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

// ➤ Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➤ Search documents by title, description, or content
exports.searchDocuments = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) return res.status(400).json({ error: "Keyword is required" });

    const documents = await Document.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { keywords: { $in: [keyword.toLowerCase()] } },
      ],
    });

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

    // Delete file from storage
    fs.unlinkSync(path.join(__dirname, `../${document.filePath}`));

    await document.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: err.message });
  }
};
