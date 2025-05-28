const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/documents2p0Controller");

// Routes
router.post("/upload", upload.single("image"), controller.uploadDocument);
router.get("/", controller.getDocuments);
router.delete("/", controller.deleteDocument);

module.exports = router;
