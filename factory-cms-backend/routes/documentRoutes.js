const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: API for managing documents
 */

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a document (PDF)
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: File upload error
 *       500:
 *         description: Internal server error
 */
router.post("/upload", upload.single("document"), documentController.uploadDocument);

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of all documents
 *       500:
 *         description: Internal server error
 */
router.get("/", documentController.getAllDocuments);

/**
 * @swagger
 * /api/documents/search:
 *   get:
 *     summary: Search documents by keyword
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search within documents
 *     responses:
 *       200:
 *         description: List of matching documents
 *       400:
 *         description: Missing keyword parameter
 *       500:
 *         description: Internal server error
 */
router.get("/search", documentController.searchDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document details
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", documentController.getDocumentById);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
