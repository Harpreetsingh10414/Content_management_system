const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/drawings2p0Controller");

// Upload multiple drawing images
router.post("/upload-multiple", upload.array("images", 10), controller.uploadMultipleDrawings);

// Get all drawings or filter by machineCode
router.get("/", controller.getAllDrawings);

// Delete by name
router.delete("/name/:name", controller.deleteByName);

// Delete by machineCode
router.delete("/machine/:machineCode", controller.deleteByMachineCode);
router.delete("/id/:id", controller.deleteById); 

module.exports = router;
