const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/documents2p0Controller");

// Upload multiple images (key = images)
router.post("/upload-multiple", upload.array("images"), controller.uploadMultipleDocuments);

// Get all or by machineCode
router.get("/", controller.getDocuments);

// Delete by name + machineCode
router.delete("/", controller.deleteDocument);

// Delete by ID
router.delete("/id/:id", controller.deleteById);

module.exports = router;
