const express = require("express");
const router = express.Router();
const dosDontsController = require("../controllers/dosDontsController");
const upload = require("../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: DosDonts
 *   description: API for managing Do's and Don'ts images
 */

/**
 * @swagger
 * /api/dos-donts/upload:
 *   post:
 *     summary: Upload an image for Do's and Don'ts
 *     tags: [DosDonts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               approvedBy:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               revision:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: File upload error
 *       500:
 *         description: Internal server error
 */
router.post("/upload", upload.single("image"), dosDontsController.uploadImage);

/**
 * @swagger
 * /api/dos-donts:
 *   get:
 *     summary: Get all Do's and Don'ts images
 *     tags: [DosDonts]
 *     responses:
 *       200:
 *         description: List of all Do's and Don'ts images
 *       500:
 *         description: Internal server error
 */
router.get("/", dosDontsController.getAllImages);

/**
 * @swagger
 * /api/dos-donts/search:
 *   get:
 *     summary: Search Do's and Don'ts images by keyword
 *     tags: [DosDonts]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search within Do's and Don'ts images
 *     responses:
 *       200:
 *         description: List of matching images
 *       400:
 *         description: Missing keyword parameter
 *       500:
 *         description: Internal server error
 */
router.get("/search", dosDontsController.searchImages);

/**
 * @swagger
 * /api/dos-donts/{id}:
 *   get:
 *     summary: Get a Do's and Don'ts image by ID
 *     tags: [DosDonts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image details
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", dosDontsController.getImageById);

/**
 * @swagger
 * /api/dos-donts/{id}:
 *   delete:
 *     summary: Delete a Do's and Don'ts image
 *     tags: [DosDonts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", dosDontsController.deleteImage);

module.exports = router;
